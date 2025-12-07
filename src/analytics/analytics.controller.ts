import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@ApiBearerAuth('JWT-auth')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overall')
  @ApiOperation({ summary: 'Get overall analytics for all ads' })
  @ApiResponse({
    status: 200,
    description: 'Overall analytics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getOverallAnalytics() {
    return this.analyticsService.getOverallAnalytics();
  }

  @Get('ad/:id')
  @ApiOperation({ summary: 'Get analytics for specific ad' })
  @ApiParam({ name: 'id', description: 'Ad ID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Ad analytics retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAdAnalytics(@Param('id') id: string) {
    return this.analyticsService.getAdAnalytics(id);
  }

  @Get('campaign/:id')
  @ApiOperation({ summary: 'Get analytics for specific campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Campaign analytics retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCampaignAnalytics(@Param('id') id: string) {
    return this.analyticsService.getCampaignAnalytics(id);
  }
}
