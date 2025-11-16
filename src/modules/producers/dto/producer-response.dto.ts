import { ApiProperty } from '@nestjs/swagger';

export class ProducerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  specialty?: string;

  @ApiProperty({ required: false })
  avatar?: string;
}
