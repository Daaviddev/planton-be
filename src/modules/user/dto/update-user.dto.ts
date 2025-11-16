import {
  IsEmail,
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Roles } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ isArray: true, enum: Roles, example: ['USER'] })
  @IsArray()
  @IsEnum(Roles, { each: true })
  @IsOptional()
  roles?: Roles[];

  @ApiPropertyOptional({ minLength: 6, example: 'N3wS3cret' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: 'Jane' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.png' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: '123 Main St' })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiPropertyOptional({ example: 'Springfield' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: '90210' })
  @IsString()
  @IsOptional()
  zipCode?: string;
}
