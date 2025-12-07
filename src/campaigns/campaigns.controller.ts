import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';
import { AssignAdsDto } from './dto/assign-ads.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Campaigns')
@ApiBearerAuth('JWT-auth')
@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createCampaignDto: CreateCampaignDto, @Request() req) {
    return this.campaignsService.create(createCampaignDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({
    status: 200,
    description: 'List of campaigns retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  @ApiResponse({ status: 200, description: 'Campaign retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update campaign by ID' })
  @ApiResponse({ status: 200, description: 'Campaign updated successfully' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @Request() req,
  ) {
    return this.campaignsService.update(id, updateCampaignDto, req.user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update campaign status' })
  @ApiResponse({
    status: 200,
    description: 'Campaign status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateCampaignStatusDto: UpdateCampaignStatusDto,
    @Request() req,
  ) {
    return this.campaignsService.updateStatus(
      id,
      updateCampaignStatusDto.status,
      req.user.id,
    );
  }

  @Post(':id/assign-ads')
  @ApiOperation({ summary: 'Assign ads to campaign' })
  @ApiResponse({ status: 200, description: 'Ads assigned successfully' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  assignAds(
    @Param('id') id: string,
    @Body() assignAdsDto: AssignAdsDto,
    @Request() req,
  ) {
    return this.campaignsService.assignAds(id, assignAdsDto.adIds, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete campaign by ID' })
  @ApiResponse({ status: 200, description: 'Campaign deleted successfully' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @Request() req) {
    return this.campaignsService.remove(id, req.user.id);
  }
}
