import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Placement, Status } from '@prisma/client';

export class CreateAdDto {
  @ApiProperty({ example: 'Summer Sale Banner' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://example.com/summer-sale' })
  @IsString()
  @IsNotEmpty()
  ctaLink: string;

  @ApiProperty({
    enum: Placement,
    example: 'HOMEPAGE_BANNER',
  })
  @IsEnum(Placement)
  @IsNotEmpty()
  placement: Placement;

  @ApiPropertyOptional({
    enum: Status,
    example: 'ACTIVE',
    default: 'ACTIVE',
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsUUID()
  @IsOptional()
  campaignId?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
