import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const FLUSH_EVENT = 'flush';

@Injectable()
export class FlushService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FlushService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  onModuleInit() {
    process.once('SIGTERM', () => this.flushAll());
    process.once('SIGINT', () => this.flushAll());
  }

  async onModuleDestroy() {
    await this.flushAll();
  }

  async flushAll() {
    const results = await this.eventEmitter.emitAsync(FLUSH_EVENT);

    if (results.length === 0) {
      this.logger.warn('Nothing was flushed because no flush handlers were registered.');
    }
  }
}
