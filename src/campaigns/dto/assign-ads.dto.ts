import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignAdsDto {
  @ApiProperty({
    type: [String],
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
    description: 'Array of ad IDs to assign to the campaign',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  adIds: string[];
}
