// flush.module.ts
import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FlushService } from './flush.service';

@Global()
@Module({
  imports: [EventEmitterModule],
  providers: [FlushService],
  exports: [FlushService],
})
export class FlushModule {}
