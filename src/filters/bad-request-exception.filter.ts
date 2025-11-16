import BaseExceptionFilter from './base-exception.filter';
import { BAD_REQUEST } from '@constants/errors.constants';
import { BadRequestException, Catch, HttpStatus } from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter extends BaseExceptionFilter {
  constructor() {
    super(BAD_REQUEST, HttpStatus.BAD_REQUEST);
  }
}
