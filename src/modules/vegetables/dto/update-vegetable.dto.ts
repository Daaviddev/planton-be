import { PartialType } from '@nestjs/swagger';
import { CreateVegetableDto } from './create-vegetable.dto';

export class UpdateVegetableDto extends PartialType(CreateVegetableDto) {}
