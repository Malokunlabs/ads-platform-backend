
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublicAdDto } from './dto/public-ad.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PublicAdsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getActiveAds(): Promise<PublicAdDto[]> {
    const now = new Date();
    const ads = await this.prisma.ad.findMany({
      where: {
        status: 'ACTIVE',
        startDate: { lte: now },
        endDate: { gte: now },
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        ctaLink: true,
        placement: true,
        campaign: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });
    const r2PublicUrl = this.configService.get<string>('R2_PUBLIC_URL');
    return ads.map(ad => ({
      id: ad.id,
      title: ad.title,
      imageUrl: ad.imageUrl.startsWith('http')
        ? ad.imageUrl
        : r2PublicUrl ? `${r2PublicUrl}/${ad.imageUrl}` : ad.imageUrl,
      ctaLink: ad.ctaLink,
      placement: ad.placement,
      campaignName: ad.campaign?.name,
      campaignDescription: ad.campaign?.description ?? undefined,
    }));
  }
}
