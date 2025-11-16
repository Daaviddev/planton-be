import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProducerDto {
  @ApiProperty({ example: 'John Farmer' })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'ID of the user sending the message',
    example: 'cmf1aonge0000jhyglsbmvbza',
    required: false,
  })
  @IsString()
  @IsUUID()
  userId?: string;
}
