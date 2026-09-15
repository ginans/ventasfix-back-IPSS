import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { IApiResponse } from '../../interfaces/api-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocurrió un error interno en el servidor';
    let exceptionName = 'InternalServerErrorException';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      exceptionName = exception.name;
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as any;
        if (Array.isArray(resObj.message)) {
          message = resObj.message.join(', ');
        } else if (resObj.message) {
          message = resObj.message;
        }
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Manejo de errores de unicidad o clave foránea de Prisma
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        exceptionName = 'ConflictException';
        const target = (exception.meta?.target as string[]) || [];
        message = `Ya existe un registro con el mismo valor único (${target.join(', ') || 'campo duplicado'}).`;
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        exceptionName = 'NotFoundException';
        message = 'El registro solicitado no fue encontrado.';
      } else {
        status = HttpStatus.BAD_REQUEST;
        exceptionName = 'PrismaClientError';
        message = `Error en la base de datos: ${exception.code}`;
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      message = exception.message;
    }

    const errorResponse: IApiResponse = {
      statusCode: status,
      message,
      exception: exceptionName,
    };

    response.status(status).json(errorResponse);
  }
}

