# Flush Service

This is a NestJS module that simplifies the flushing of services. The `FlushService` emits a `FLUSH_EVENT` event when the module containing the service is being destroyed. It uses the EventEmitter2 class from the `@nestjs/event-emitter` package to handle asynchronous event emissions. Additionally you can force a manual flush at any time.

## Installation

To install the package, run:

```bash
npm i @raphaabreu/nestjs-flusher
```

## Usage

Import the module `FlushModule` and add to the imports array in your module:

```typescript
import { FlushModule } from '@raphaabreu/nestjs-flusher';

@Module({
  import: [FlushModule],
})
export class YourModule {}
```

Configure a service to be flushable:

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

When the application gracefully shutdown, the `FLUSH_EVENT` will be raised, however you can at any time invoke a manual flush as below.

Inject `FlushService` into a class where you want to use it:

```typescript
import { FlushService } from '@raphaabreu/nestjs-flusher';

@Injectable()
export class SampleManualFlush {
  constructor(private readonly flushService: FlushService) {}

  async doWork() {
    // Your logic...

    // Manual flush
    await flushService.flushAll();
  }
}
```

## Tests

To run the provided unit tests just execute `npm run tests`.

## License

MIT License

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Support

If you have any issues or questions, please open an issue on the project repository.
