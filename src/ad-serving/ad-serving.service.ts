import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { Placement, Status } from '@prisma/client';

@Injectable()
export class AdServingService {
  constructor(
    private prisma: PrismaService,
    private analyticsService: AnalyticsService,
  ) {}

  async getAds(placement?: Placement, limit: number = 1) {
    const now = new Date();

    const ads = await this.prisma.ad.findMany({
      where: {
        status: Status.ACTIVE,
        startDate: { lte: now },
        endDate: { gte: now },
        ...(placement && { placement }),
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        ctaLink: true,
        placement: true,
      },
    });

    if (ads.length === 0) return [];

    const shuffled = ads.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }

  /**
   * Delegates to AnalyticsService — single source of truth.
   * Uses UTC grouping, upsert pattern. No duplicate rows.
   */
  async trackImpression(adId: string) {
    await this.analyticsService.recordImpression(adId);
    return { success: true };
  }

  async trackClick(adId: string) {
    await this.analyticsService.recordClick(adId);
    return { success: true };
  }
}
