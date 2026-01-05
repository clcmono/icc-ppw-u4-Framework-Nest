import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from '../base/application.exception';

export class BadRequestException extends ApplicationException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}
