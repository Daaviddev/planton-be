import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PlotStatus } from '@prisma/client';

export class ChangeStatusDto {
  @ApiProperty({ enum: PlotStatus })
  @IsEnum(PlotStatus)
  status: PlotStatus;
}
