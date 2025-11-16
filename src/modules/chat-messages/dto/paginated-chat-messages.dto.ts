import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageListItemDto } from './chat-message-list-item.dto';

export class PaginatedChatMessagesDto {
  @ApiProperty({
    description: 'Array of chat messages',
    type: [ChatMessageListItemDto],
  })
  data: ChatMessageListItemDto[];

  @ApiProperty({
    description: 'Total number of messages matching the query',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Number of messages per page',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Number of messages skipped',
    example: 0,
  })
  offset: number;

  @ApiProperty({
    description: 'Current page number (1-based)',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 8,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there are more messages after this page',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there are messages before this page',
    example: false,
  })
  hasPrev: boolean;
}
