import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsISO8601 } from 'class-validator';
import { ActivityType } from '@prisma/client';

export class CreateActivityDto {
  @ApiProperty({ example: 'garden-id' })
  @IsString()
  gardenId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  type: ActivityType;

  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  date: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
