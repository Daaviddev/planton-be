import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDeliveryAddressDto {
  @ApiProperty({ example: 'user-id' })
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  zipCode: string;
}
