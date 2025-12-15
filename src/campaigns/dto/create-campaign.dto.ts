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

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z' })
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2024-08-31T23:59:59.000Z' })
  @IsNotEmpty()
  endDate: Date;

  @ApiPropertyOptional({
    enum: Status,
    example: 'ACTIVE',
    default: 'ACTIVE',
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
