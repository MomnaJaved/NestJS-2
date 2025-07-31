import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((err: unknown) => {
        // Type guard to safely access 'message'
        if (err instanceof Error) {
          console.error('Error:', err.message);
          return throwError(() => err);
        } else {
          console.error('Unknown error:', err);
          // Wrap unknown error in a generic Error to satisfy typing
          return throwError(() => new Error('Unknown error occurred'));
        }
      }),
    );
  }
}
