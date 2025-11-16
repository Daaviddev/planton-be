import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Sender } from '@prisma/client';

export class CreateChatMessageDto {
  @ApiProperty({
    description: 'ID of the user sending the message',
    example: 'cmf1aonge0000jhyglsbmvbza',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Type of sender',
    enum: Sender,
    example: Sender.USER,
    required: true,
  })
  @IsEnum(Sender)
  sender: Sender;

  @ApiProperty({
    description: 'The message text content',
    example: 'Hello, how is my garden doing?',
    required: true,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  text: string;

  @ApiProperty({
    description: 'ID of the garden this message belongs to',
    example: 'cmf1aonge0000jhyglsbmvbza',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  gardenId: string;
}
