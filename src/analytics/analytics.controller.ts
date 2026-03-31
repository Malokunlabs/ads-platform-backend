import {
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Redirect,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
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
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ─── Public Tracking Endpoints (no JWT required) ──────────────────────────

  /**
   * Called silently by the frontend (IntersectionObserver) when the ad
   * scrolls into the user's viewport.
   * POST /analytics/impression/:id
   */
  @Post('impression/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Record an ad impression (view)' })
  @ApiParam({ name: 'id', description: 'Ad ID', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Impression recorded' })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  async recordImpression(@Param('id') id: string): Promise<void> {
    await this.analyticsService.recordImpression(id);
  }

  /**
   * Redirect endpoint that counts the click then sends the user to the
   * ad's destination URL.
   * GET /analytics/click/:id
   */
  @Get('click/:id')
  @Redirect('', 302)
  @ApiOperation({ summary: 'Track an ad click and redirect to destination' })
  @ApiParam({ name: 'id', description: 'Ad ID', format: 'uuid' })
  @ApiResponse({ status: 302, description: 'Redirected to ad destination' })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  async trackClick(@Param('id') id: string) {
    const ctaLink = await this.analyticsService.recordClick(id);
    if (!ctaLink) throw new NotFoundException(`Ad ${id} has no destination URL`);
    return { url: ctaLink, statusCode: 302 };
  }

  // ─── Admin-only Reporting Endpoints (JWT required) ────────────────────────

  @Get('overall')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
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
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
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
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
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
