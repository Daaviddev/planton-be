import { ApiProperty } from '@nestjs/swagger';

export class DeliveryAddressResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  zipCode: string;
}
