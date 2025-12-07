import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAdAnalytics(adId: string) {
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
      return null;
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
