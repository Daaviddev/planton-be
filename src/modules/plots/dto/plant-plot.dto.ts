import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsISO8601 } from 'class-validator';

export class PlantPlotDto {
  @ApiProperty({ description: 'Vegetable ID to plant' })
  @IsString()
  vegetableId: string;

  @ApiProperty({ required: false, description: 'Planted date (ISO8601)' })
  @IsOptional()
  @IsISO8601()
  plantedDate?: string;
}
