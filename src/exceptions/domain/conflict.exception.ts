import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from '../base/application.exception';

export class ConflictException extends ApplicationException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}
