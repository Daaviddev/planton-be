import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateChatMessageDto {
  @ApiPropertyOptional({
    description: 'Updated message text content',
    example: 'Updated message text',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  text?: string;
}
