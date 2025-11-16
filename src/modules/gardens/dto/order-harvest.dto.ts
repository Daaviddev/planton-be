import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OrderHarvestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class OrderHarvestAllDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
