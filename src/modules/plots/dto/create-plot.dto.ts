import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsNumber,
  IsISO8601,
} from 'class-validator';
import { PlotStatus } from '@prisma/client';

export class CreatePlotDto {
  @ApiProperty({ example: 'garden-id' })
  @IsString()
  gardenId: string;

  @ApiProperty({ enum: PlotStatus })
  @IsEnum(PlotStatus)
  status: PlotStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vegetableId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  healthScore?: number;

  @ApiProperty({ required: false, format: 'date-time' })
  @IsOptional()
  @IsISO8601()
  plantedDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  progress?: number;
}
