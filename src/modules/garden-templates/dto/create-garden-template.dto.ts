import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { GardenType } from '@prisma/client';

export class CreateGardenTemplateDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: GardenType })
  @IsEnum(GardenType)
  type!: GardenType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cameraUrlTemplate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  producerId?: string;

  @ApiProperty({ required: false, default: 9 })
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultPlots?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxInstances?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  allowedVegetableIds?: string[];
}
