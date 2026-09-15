import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    const statusCode = response.statusCode;
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
      request.method,
    );

    return next.handle().pipe(
      map((res) => {
        // Si el controlador devolvió explícitamente { message, data }
        if (res && typeof res === 'object' && 'message' in res) {
          const { message, data } = res;
          const result: IApiResponse<T> = {
            statusCode,
            message,
          };
          if (data !== undefined) {
            result.data = data;
          }
          return result;
        }

        // Para mutaciones (POST, PUT, DELETE) que devuelven vacío o sin mensaje
        if (isMutation) {
          return {
            statusCode,
            message: 'Operación realizada con éxito',
          };
        }

        // Para consultas (GET), devolvemos la data obtenida
        return {
          statusCode,
          message: 'Operación realizada con éxito',
          data: res,
        };
      }),
    );
  }
}

