import { ApiProperty } from '@nestjs/swagger';

export class GardenResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ format: 'date-time' })
  leaseDate: string;

  @ApiProperty({ required: false })
  templateId?: string;
}
