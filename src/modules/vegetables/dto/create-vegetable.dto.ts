import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';

export class CreateVegetableDto {
  @ApiProperty({ example: 'Tomato' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2.5 })
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ example: [3, 4, 5] })
  @IsArray()
  plantableMonths: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiProperty({ example: [7, 8] })
  @IsArray()
  harvestMonths: number[];

  @ApiProperty({ example: ['Basil'] })
  @IsArray()
  companions: string[];

  @ApiProperty({ example: ['Potatoes'] })
  @IsArray()
  incompatible: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  facts?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  growthTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  season?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  water?: string;
}
