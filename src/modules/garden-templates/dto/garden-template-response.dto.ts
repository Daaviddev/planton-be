import { ApiProperty } from '@nestjs/swagger';
import { GardenType } from '@prisma/client';

class AllowedVegetableDto {
  @ApiProperty()
  vegetableId!: string;
}

export class GardenTemplateResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: GardenType })
  type!: GardenType;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  cameraUrlTemplate?: string;

  @ApiProperty({ required: false })
  producerId?: string;

  @ApiProperty()
  defaultPlots!: number;

  @ApiProperty()
  maxInstances!: number;

  @ApiProperty({ type: [AllowedVegetableDto] })
  allowedVegetables!: AllowedVegetableDto[];

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}
