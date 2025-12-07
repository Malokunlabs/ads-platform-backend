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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { UpdateAdStatusDto } from './dto/update-ad-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Ads')
@ApiBearerAuth('JWT-auth')
@Controller('ads')
@UseGuards(JwtAuthGuard)
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ad with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'title',
        'ctaLink',
        'placement',
        'startDate',
        'endDate',
        'image',
      ],
      properties: {
        title: { type: 'string' },
        ctaLink: { type: 'string' },
        placement: {
          type: 'string',
          enum: ['HOMEPAGE_BANNER', 'SIDEBAR', 'FOOTER', 'POPUP', 'INLINE'],
        },
        status: { type: 'string', enum: ['ACTIVE', 'PAUSED', 'ARCHIVED'] },
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
        campaignId: { type: 'string', format: 'uuid' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Ad created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or missing image' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/ads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() createAdDto: CreateAdDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const adData = {
      ...createAdDto,
      imageUrl: `/uploads/ads/${file.filename}`,
    };

    return this.adsService.create(adData, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ads for current admin' })
  @ApiResponse({
    status: 200,
    description: 'List of ads retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.adsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ad by ID' })
  @ApiResponse({ status: 200, description: 'Ad retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ad by ID' })
  @ApiResponse({ status: 200, description: 'Ad updated successfully' })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateAdDto: UpdateAdDto,
    @Request() req,
  ) {
    return this.adsService.update(id, updateAdDto, req.user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update ad status' })
  @ApiResponse({ status: 200, description: 'Ad status updated successfully' })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateAdStatusDto: UpdateAdStatusDto,
    @Request() req,
  ) {
    return this.adsService.updateStatus(
      id,
      updateAdStatusDto.status,
      req.user.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ad by ID' })
  @ApiResponse({ status: 200, description: 'Ad deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @Request() req) {
    return this.adsService.remove(id, req.user.id);
  }
}
