import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { FlushInterceptor } from './flush.interceptor';
import { FlushService } from './flush.service';

describe('FlushInterceptor', () => {
  let interceptor: FlushInterceptor;
  let flushService: FlushService;

  beforeEach(() => {
    flushService = { flushAll: jest.fn().mockResolvedValue(undefined) } as any;
    interceptor = new FlushInterceptor(flushService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should call flushService.flushAll() after request completes', (done) => {
    // Arrange
    const context = {} as ExecutionContext;
    const responseData = { message: 'test' };
    const next: CallHandler = { handle: () => of(responseData) };

    // Act
    interceptor.intercept(context, next).subscribe({
      next: (result) => {
        // Assert
        expect(flushService.flushAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(responseData);
        done();
      },
      error: done.fail,
    });
  });

  it('should pass through response data unmodified', (done) => {
    // Arrange
    const context = {} as ExecutionContext;
    const responseData = { id: 1, name: 'test', nested: { value: true } };
    const next: CallHandler = { handle: () => of(responseData) };

    // Act
    interceptor.intercept(context, next).subscribe({
      next: (result) => {
        // Assert
        expect(result).toEqual(responseData);
        done();
      },
      error: done.fail,
    });
  });
});
