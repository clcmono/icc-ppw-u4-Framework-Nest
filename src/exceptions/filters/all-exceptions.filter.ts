import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let details: Record<string, string> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        const responseObject = exceptionResponse as any;

        // Caso: Error de validación con class-validator
        if (Array.isArray(responseObject.message)) {
          message = 'Datos de entrada inválidos';
          details = this.extractValidationErrors(responseObject.message);
        } else {
          message = responseObject.message || exception.message;
        }
      } else {
        message = exception.message;
      }
    } else {
      // Error no controlado
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
    }

    const errorResponse: ErrorResponse = {
      timestamp: new Date().toISOString(),
      status,
      error: HttpStatus[status] || 'Internal Server Error',
      message,
      path: request.url,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }

  private extractValidationErrors(messages: any): Record<string, string> {
    const errors: Record<string, string> = {};

    if (Array.isArray(messages)) {
      messages.forEach((msg) => {
        if (typeof msg === 'object' && msg.property && msg.constraints) {
          // Formato completo de ValidationError
          const firstConstraint = Object.values(msg.constraints)[0];
          errors[msg.property] = firstConstraint as string;
        } else if (typeof msg === 'string') {
          const parts = msg.split(' ');
          errors[parts[0]] = msg;
        }
      });
    }

    return errors;
  }
}
