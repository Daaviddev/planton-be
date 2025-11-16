import { ApiProperty } from '@nestjs/swagger';

export class VegetableResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  icon?: string;
}
