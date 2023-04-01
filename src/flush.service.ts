import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class FlushService implements OnModuleDestroy {
  private readonly logger = new Logger(FlushService.name);

  public static FLUSH_EVENT = 'flush';

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async onModuleDestroy() {
    await this.flushAll();
  }

  async flushAll() {
    const results = await this.eventEmitter.emitAsync(FlushService.FLUSH_EVENT);

    if (results.length === 0) {
      this.logger.warn('No listeners for flush event');
    }
  }
}
