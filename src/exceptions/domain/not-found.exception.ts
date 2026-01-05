import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from '../base/application.exception';

export class NotFoundException extends ApplicationException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}
