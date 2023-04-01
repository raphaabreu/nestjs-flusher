// flush.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FlushService, FLUSH_EVENT } from './flush.service';

describe('FlushService', () => {
  let flushService: FlushService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlushService, EventEmitter2],
    }).compile();

    flushService = module.get<FlushService>(FlushService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(flushService).toBeDefined();
  });

  describe('flushAll', () => {
    it('should emit a flush event', async () => {
      // Arrange
      const emitAsyncSpy = jest.spyOn(eventEmitter, 'emitAsync').mockResolvedValue([]);

      // Act
      await flushService.flushAll();

      // Assert
      expect(emitAsyncSpy).toHaveBeenCalledWith(FLUSH_EVENT);
    });
  });

  describe('onModuleDestroy', () => {
    it('should call flushAll method', async () => {
      // Arrange
      const flushAllSpy = jest.spyOn(flushService, 'flushAll').mockResolvedValue(undefined);

      // Act
      await flushService.onModuleDestroy();

      // Assert
      expect(flushAllSpy).toHaveBeenCalledTimes(1);
    });
  });
});
