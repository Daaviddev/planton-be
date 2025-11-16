import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Roles } from '@prisma/client';

export class UserDto {
  @ApiProperty({ example: 'usr_123', description: 'User ID' })
  id: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  email?: string | null;

  @ApiPropertyOptional({ example: 'Jane' })
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Doe' })
  lastName?: string | null;

  @ApiPropertyOptional({ example: '+1234567890' })
  phone?: string | null;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.png' })
  avatar?: string | null;

  @ApiPropertyOptional({ example: '123 Main St' })
  street?: string | null;

  @ApiPropertyOptional({ example: 'Springfield' })
  city?: string | null;

  @ApiPropertyOptional({ example: '90210' })
  zipCode?: string | null;

  @ApiProperty({ isArray: true, enum: Roles, example: ['USER'] })
  roles: Roles[];

  @Exclude()
  password?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
