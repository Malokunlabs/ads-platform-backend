import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Placement, Status } from '@prisma/client';

@Injectable()
export class AdServingService {
  constructor(private prisma: PrismaService) {}

  async getAds(placement?: Placement, limit: number = 1) {
    const now = new Date();

    const ads = await this.prisma.ad.findMany({
      where: {
        status: Status.ACTIVE,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
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

    if (ads.length === 0) {
      return [];
    }

    const shuffled = ads.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }

  async trackImpression(adId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analytics = await this.prisma.adAnalytics.findFirst({
      where: {
        adId,
        date: {
          gte: today,
        },
      },
    });

    if (analytics) {
      await this.prisma.adAnalytics.update({
        where: { id: analytics.id },
        data: {
          impressions: {
            increment: 1,
          },
        },
      });
    } else {
      await this.prisma.adAnalytics.create({
        data: {
          adId,
          impressions: 1,
          clicks: 0,
          date: today,
        },
      });
    }

    return { success: true };
  }

  async trackClick(adId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analytics = await this.prisma.adAnalytics.findFirst({
      where: {
        adId,
        date: {
          gte: today,
        },
      },
    });

    if (analytics) {
      await this.prisma.adAnalytics.update({
        where: { id: analytics.id },
        data: {
          clicks: {
            increment: 1,
          },
        },
      });
    } else {
      await this.prisma.adAnalytics.create({
        data: {
          adId,
          impressions: 0,
          clicks: 1,
          date: today,
        },
      });
    }

    return { success: true };
  }
}
