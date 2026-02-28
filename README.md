# NestJS Flusher

This is a NestJS module that simplifies the flushing of services. The `FlushService` emits a `FLUSH_EVENT` event when the module containing the service is being destroyed. It uses the EventEmitter2 class from the `@nestjs/event-emitter` package to handle asynchronous event emissions. Additionally you can force a manual flush at any time.

## Installation

To install the package, run:

```bash
npm i @raphaabreu/nestjs-flusher
```

## Usage

### Basic usage (flush on shutdown)

Import the module `FlushModule` and add to the imports array in your module:

```typescript
import { FlushModule } from '@raphaabreu/nestjs-flusher';

@Module({
  imports: [FlushModule],
})
export class YourModule {}
```

This will automatically flush all registered handlers when the module is destroyed and when SIGTERM/SIGINT signals are received.

### Per-request flushing (recommended for Lambda/serverless)

In AWS Lambda and other serverless environments, the runtime can freeze immediately after a response is sent. Buffered operations (CloudWatch metric writes, log batches, etc.) may be lost if not flushed before the response completes. Use `FlushModule.withFlushOnRequest()` to automatically flush after every HTTP request:

```typescript
import { FlushModule } from '@raphaabreu/nestjs-flusher';

@Module({
  imports: [FlushModule.withFlushOnRequest()],
})
export class AppModule {}
```

This registers a global NestJS interceptor that calls `flushAll()` after each request handler completes, ensuring all buffered data is written before the response is sent back.

### Comparison

| Feature | `FlushModule` | `FlushModule.withFlushOnRequest()` |
|---|---|---|
| Flush on module destroy | Yes | Yes |
| Flush on SIGTERM/SIGINT | Yes | Yes |
| Flush after each HTTP request | No | Yes |

### Configuring flushable services

Configure a service to be flushable by listening to the `FLUSH_EVENT`:

```typescript
import { FLUSH_EVENT } from '@raphaabreu/nestjs-flusher';

@Injectable()
export class SampleService {
  @OnEvent(FLUSH_EVENT)
  async flush(): Promise<void> {
    // Execute async flush logic, this can be sync or async.
  }
}
```

When the application gracefully shuts down or receives SIGTERM/SIGINT, the `FLUSH_EVENT` will be raised automatically. You can also invoke a manual flush at any time:

```typescript
import { FlushService } from '@raphaabreu/nestjs-flusher';

@Injectable()
export class SampleManualFlush {
  constructor(private readonly flushService: FlushService) {}

  async doWork() {
    // Your logic...

    // Manual flush
    await this.flushService.flushAll();
  }
}
```

### Signal handling

`FlushService` automatically registers `SIGTERM` and `SIGINT` handlers via `process.once()` during module initialization. This ensures flushing happens on process termination regardless of whether the consuming app calls `app.enableShutdownHooks()`. Double-flushing is harmless — a second flush finds nothing buffered and returns immediately.

Note: `app.enableShutdownHooks()` is still recommended for running the full NestJS shutdown lifecycle (all `OnModuleDestroy` handlers), but is no longer strictly required just for flushing.

## Tests

To run the provided unit tests just execute `npm run test`.

## License

MIT License

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Support

If you have any issues or questions, please open an issue on the project repository.
