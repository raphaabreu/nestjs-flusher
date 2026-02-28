import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { mergeMap, Observable } from 'rxjs';
import { FlushService } from './flush.service';

@Injectable()
export class FlushInterceptor implements NestInterceptor {
  constructor(private readonly flushService: FlushService) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      mergeMap(async (data) => {
        await this.flushService.flushAll();
        return data;
      }),
    );
  }
}
