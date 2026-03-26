import { Module } from '@nestjs/common';
import { PublicAdsController } from './public-ads.controller';
import { PublicAdsService } from './public-ads.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PublicAdsController],
  providers: [PublicAdsService],
})
export class PublicAdsModule {}
