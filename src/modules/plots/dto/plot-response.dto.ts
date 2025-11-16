import { ApiProperty } from '@nestjs/swagger';
import { PlotStatus } from '@prisma/client';

export class PlotResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  gardenId: string;

  @ApiProperty({ enum: PlotStatus })
  status: PlotStatus;

  @ApiProperty({ required: false })
  vegetableId?: string;
}
