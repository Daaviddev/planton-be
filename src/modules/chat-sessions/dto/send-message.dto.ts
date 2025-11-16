import { IsString, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ enum: ['USER', 'BOT', 'PRODUCER'] })
  @IsEnum(['USER', 'BOT', 'PRODUCER'])
  sender: 'USER' | 'BOT' | 'PRODUCER';

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  gardenId: string;
}
