// flush.module.ts
import { Module, Global, DynamicModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FlushService } from './flush.service';
import { FlushInterceptor } from './flush.interceptor';

@Global()
@Module({
  imports: [EventEmitterModule],
  providers: [FlushService],
  exports: [FlushService],
})
export class FlushModule {
  static withFlushOnRequest(): DynamicModule {
    return {
      module: FlushModule,
      global: true,
      imports: [EventEmitterModule],
      providers: [
        FlushService,
        { provide: APP_INTERCEPTOR, useClass: FlushInterceptor },
      ],
      exports: [FlushService],
    };
  }
}
