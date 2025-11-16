import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatSessionDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  producerId?: string;

  @ApiProperty()
  @IsString()
  gardenId: string;
}
