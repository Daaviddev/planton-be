import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsISO8601 } from 'class-validator';

export class CreateGardenDto {
  @ApiProperty({ example: 'Community Garden #1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  leaseDate: string;

  // userId is no longer part of creation; leasing is a separate action
}
