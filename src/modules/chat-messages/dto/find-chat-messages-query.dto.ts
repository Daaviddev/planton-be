import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { Sender } from '@prisma/client';
import { Type } from 'class-transformer';

export class FindChatMessagesQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: 'cmf1aonge0000jhyglsbmvbza',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by garden ID',
    example: 'cmf1aonge0000jhyglsbmvbza',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  gardenId?: string;

  @ApiPropertyOptional({
    description: 'Filter by sender type',
    enum: Sender,
    example: Sender.USER,
  })
  @IsOptional()
  @IsEnum(Sender)
  sender?: Sender;

  @ApiPropertyOptional({
    description: 'Filter messages created after this date',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  createdAfter?: Date;

  @ApiPropertyOptional({
    description: 'Filter messages created before this date',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  createdBefore?: Date;

  @ApiPropertyOptional({
    description: 'Search in message text (case-insensitive)',
    example: 'garden',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Number of messages to return',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Number of messages to skip',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sort?: 'asc' | 'desc' = 'desc';
}
