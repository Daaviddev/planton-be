import { type TransformedErrors } from '@filters/validation-exception-factory';
import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(
    public validationErrors: TransformedErrors | TransformedErrors[],
  ) {
    super();
  }
}
