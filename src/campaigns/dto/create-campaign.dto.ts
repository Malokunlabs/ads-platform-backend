import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Summer Campaign 2024' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Campaign for summer promotions' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: Status,
    example: 'ACTIVE',
    default: 'ACTIVE',
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
