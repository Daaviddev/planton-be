import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PlantVegetableDto {
  @ApiProperty({ description: 'Vegetable ID to plant' })
  @IsString()
  @IsNotEmpty()
  vegetableId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}
