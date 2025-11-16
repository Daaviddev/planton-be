import {
  IsEmail,
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Roles } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    isArray: true,
    enum: Roles,
    required: false,
    example: ['USER'],
  })
  @IsArray()
  @IsEnum(Roles, { each: true })
  @IsOptional()
  roles?: Roles[];

  @ApiProperty({ minLength: 6, example: 'S3cretP@ss', required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false, example: 'Jane' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false, example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    required: false,
    example: 'https://cdn.example.com/avatar.png',
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false, example: '123 Main St' })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({ required: false, example: 'Springfield' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false, example: '90210' })
  @IsString()
  @IsOptional()
  zipCode?: string;
}
