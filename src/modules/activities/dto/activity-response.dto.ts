import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from '@prisma/client';

export class ActivityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  gardenId: string;

  @ApiProperty({ enum: ActivityType })
  type: ActivityType;

  @ApiProperty({ format: 'date-time' })
  date: string;
}
