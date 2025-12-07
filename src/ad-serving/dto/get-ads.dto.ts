import { IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Placement } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAdsDto {
  @ApiPropertyOptional({
    enum: Placement,
    example: 'HOMEPAGE_BANNER',
    description: 'Filter ads by placement',
  })
  @IsEnum(Placement)
  @IsOptional()
  placement?: Placement;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 10,
    default: 1,
    description: 'Number of ads to return',
  })
  @IsInt()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}
