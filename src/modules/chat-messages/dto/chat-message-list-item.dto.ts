import { ApiProperty } from '@nestjs/swagger';
import { Sender } from '@prisma/client';

export class ChatMessageListItemDto {
  @ApiProperty({
    description: 'Message ID',
    example: 'cmf1aonge0000jhyglsbmvbza',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the user who sent the message',
    example: 'cmf1aonge0000jhyglsbmvbza',
  })
  userId: string;

  @ApiProperty({
    description: 'Type of sender',
    enum: Sender,
    example: Sender.USER,
  })
  sender: Sender;

  @ApiProperty({
    description: 'The message text content',
    example: 'Hello, how is my garden doing?',
  })
  text: string;

  @ApiProperty({
    description: 'ID of the garden this message belongs to',
    example: 'cmf1aonge0000jhyglsbmvbza',
  })
  gardenId: string;

  @ApiProperty({
    description: 'When the message was created',
    example: '2025-01-15T10:30:00.000Z',
  })
  createdAt: Date;
}
