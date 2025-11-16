import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class LeaseTemplateDto {
  @ApiProperty({ description: 'Name for the newly created garden instance' })
  @IsString()
  name!: string;

  @ApiProperty({ required: false, description: 'User who leases the garden' })
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
