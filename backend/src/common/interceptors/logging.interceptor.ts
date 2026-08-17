import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const requestId = uuidv4();
    const { method, url } = request;
    const userId = request.user?.id || 'anonymous';

    request.requestId = requestId;

    const startTime = Date.now();

    this.logger.log({
      requestId,
      method,
      url,
      userId,
      message: 'Incoming request',
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          this.logger.log({
            requestId,
            method,
            url,
            userId,
            statusCode,
            duration: `${duration}ms`,
            message: 'Request completed',
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;
          this.logger.error({
            requestId,
            method,
            url,
            userId,
            statusCode,
            duration: `${duration}ms`,
            error: error.message,
            message: 'Request failed',
          });
        },
      }),
    );
  }
}
