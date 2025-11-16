import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class LeaseGardenDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ required: false, format: 'date-time' })
  @IsOptional()
  @IsISO8601()
  date?: string;
}
