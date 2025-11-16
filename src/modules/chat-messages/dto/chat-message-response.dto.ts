import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sender } from '@prisma/client';

export class ChatMessageUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'cmf1aonge0000jhyglsbmvbza',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'user@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;
}

export class ChatMessageGardenDto {
  @ApiProperty({
    description: 'Garden ID',
    example: 'cmf1aonge0000jhyglsbmvbza',
  })
  id: string;

  @ApiProperty({
    description: 'Garden name',
    example: 'My Vegetable Garden',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Garden camera URL',
    example: 'https://example.com/camera',
  })
  cameraUrl?: string;
}

export class ChatMessageResponseDto {
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

  @ApiPropertyOptional({
    description: 'User information',
    type: ChatMessageUserDto,
  })
  user?: ChatMessageUserDto;

  @ApiPropertyOptional({
    description: 'Garden information',
    type: ChatMessageGardenDto,
  })
  garden?: ChatMessageGardenDto;
}
