import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateChatSessionDto } from './create-chat-session.dto';

export class UpdateChatSessionDto extends PartialType(CreateChatSessionDto) {
  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty({ required: false })
  producerId?: string;

  @ApiProperty({ required: false })
  gardenId?: string;
}
