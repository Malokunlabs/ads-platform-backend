import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { AdServingService } from './ad-serving.service';
import { GetAdsDto } from './dto/get-ads.dto';
import { TrackEventDto } from './dto/track-event.dto';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';

@ApiTags('Ad Serving')
@ApiSecurity('api-key')
@Controller('api/ads')
@UseGuards(ApiKeyGuard)
export class AdServingController {
  constructor(private readonly adServingService: AdServingService) {}

  @Get()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Get active ads for serving' })
  @ApiQuery({
    name: 'placement',
    required: false,
    enum: ['HOMEPAGE_BANNER', 'SIDEBAR', 'FOOTER', 'POPUP', 'INLINE'],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    minimum: 1,
    maximum: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Active ads retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid API key' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  getAds(@Query() query: GetAdsDto) {
    return this.adServingService.getAds(query.placement, query.limit);
  }

  @Post('track/impression')
  @ApiOperation({ summary: 'Track ad impression' })
  @ApiResponse({ status: 201, description: 'Impression tracked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid ad ID' })
  @ApiResponse({ status: 401, description: 'Invalid API key' })
  trackImpression(@Body() trackEventDto: TrackEventDto) {
    return this.adServingService.trackImpression(trackEventDto.adId);
  }

  @Post('track/click')
  @ApiOperation({ summary: 'Track ad click' })
  @ApiResponse({ status: 201, description: 'Click tracked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid ad ID' })
  @ApiResponse({ status: 401, description: 'Invalid API key' })
  trackClick(@Body() trackEventDto: TrackEventDto) {
    return this.adServingService.trackClick(trackEventDto.adId);
  }
}
