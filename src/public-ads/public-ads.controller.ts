import { Controller, Get, Query } from '@nestjs/common';
import { PublicAdsService } from './public-ads.service';
import { PublicAdDto } from './dto/public-ad.dto';

@Controller('public-ads')
export class PublicAdsController {
  constructor(private readonly publicAdsService: PublicAdsService) {}

  @Get()
  async getPublicAds(): Promise<PublicAdDto[]> {
    return this.publicAdsService.getActiveAds();
  }
}
