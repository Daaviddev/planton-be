import { PartialType } from '@nestjs/swagger';
import { CreateGardenTemplateDto } from './create-garden-template.dto';

export class UpdateGardenTemplateDto extends PartialType(
  CreateGardenTemplateDto,
) {}
