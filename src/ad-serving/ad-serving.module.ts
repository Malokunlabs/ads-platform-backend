import { Module } from '@nestjs/common';
import { AdServingService } from './ad-serving.service';
import { AdServingController } from './ad-serving.controller';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [AnalyticsModule],
  controllers: [AdServingController],
  providers: [AdServingService],
})
export class AdServingModule {}
