import { Module } from '@nestjs/common';
import { AdServingService } from './ad-serving.service';
import { AdServingController } from './ad-serving.controller';

@Module({
  controllers: [AdServingController],
  providers: [AdServingService],
})
export class AdServingModule {}
