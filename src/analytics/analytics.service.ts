import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns the start of today (midnight UTC) for grouping analytics per day.
   */
  private todayUtc(): Date {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Record one impression (view) for an ad.
   * Creates or increments today's AdAnalytics row.
   */
  async recordImpression(adId: string): Promise<void> {
    const ad = await this.prisma.ad.findUnique({ where: { id: adId } });
    if (!ad) throw new NotFoundException(`Ad ${adId} not found`);

    const today = this.todayUtc();
    await this.prisma.adAnalytics.upsert({
      where: {
        // Use a compound unique index – see schema note below
        adId_date: { adId, date: today },
      },
      create: { adId, date: today, impressions: 1, clicks: 0 },
      update: { impressions: { increment: 1 } },
    });
  }

  /**
   * Record one click for an ad.
   * Creates or increments today's AdAnalytics row.
   * Returns the ad's ctaLink so the controller can redirect the user.
   */
  async recordClick(adId: string): Promise<string> {
    const ad = await this.prisma.ad.findUnique({ where: { id: adId } });
    if (!ad) throw new NotFoundException(`Ad ${adId} not found`);

    // Guard: ctaLink must be an absolute URL, otherwise redirect would loop
    if (!ad.ctaLink?.startsWith('http')) {
      throw new NotFoundException(`Ad ${adId} has an invalid destination URL: "${ad.ctaLink}"`);
    }
    const today = this.todayUtc();
    await this.prisma.adAnalytics.upsert({
      where: { adId_date: { adId, date: today } },
      create: { adId, date: today, impressions: 0, clicks: 1 },
      update: { clicks: { increment: 1 } },
    });

    return ad.ctaLink;
  }

  async getAdAnalytics(adId: string) {
    const ad = await this.prisma.ad.findUnique({ where: { id: adId } });
    if (!ad) throw new NotFoundException(`Ad ${adId} not found`);

    const analytics = await this.prisma.adAnalytics.findMany({
      where: { adId },
      orderBy: { date: 'desc' },
      take: 30,
    });

    const totalImpressions = analytics.reduce(
      (sum, a) => sum + a.impressions,
      0,
    );
    const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0);
    const ctr =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      adId,
      adTitle: ad.title,
      totalImpressions,
      totalClicks,
      ctr: parseFloat(ctr.toFixed(2)),
      dailyAnalytics: analytics,
    };
  }

  async getCampaignAnalytics(campaignId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        ads: {
          include: {
            analytics: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign ${campaignId} not found`);
    }

    const totalImpressions = campaign.ads.reduce(
      (sum, ad) => sum + ad.analytics.reduce((s, a) => s + a.impressions, 0),
      0,
    );

    const totalClicks = campaign.ads.reduce(
      (sum, ad) => sum + ad.analytics.reduce((s, a) => s + a.clicks, 0),
      0,
    );

    const ctr =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      campaignId,
      campaignName: campaign.name,
      totalAds: campaign.ads.length,
      totalImpressions,
      totalClicks,
      ctr: parseFloat(ctr.toFixed(2)),
      adsAnalytics: campaign.ads.map((ad) => ({
        adId: ad.id,
        adTitle: ad.title,
        impressions: ad.analytics.reduce((sum, a) => sum + a.impressions, 0),
        clicks: ad.analytics.reduce((sum, a) => sum + a.clicks, 0),
      })),
    };
  }

  async getOverallAnalytics() {
    const ads = await this.prisma.ad.findMany({
      include: {
        analytics: true,
      },
    });

    const totalImpressions = ads.reduce(
      (sum, ad) => sum + ad.analytics.reduce((s, a) => s + a.impressions, 0),
      0,
    );

    const totalClicks = ads.reduce(
      (sum, ad) => sum + ad.analytics.reduce((s, a) => s + a.clicks, 0),
      0,
    );

    const ctr =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalAds: ads.length,
      totalImpressions,
      totalClicks,
      ctr: parseFloat(ctr.toFixed(2)),
    };
  }
}
