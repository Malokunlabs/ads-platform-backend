import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class UpdateAdStatusDto {
  @ApiProperty({
    enum: Status,
    example: 'ACTIVE',
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
