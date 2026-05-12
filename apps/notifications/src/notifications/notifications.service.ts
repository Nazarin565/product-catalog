import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs';
import { ProductEvent, ProductEventType } from '@universe/shared';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  @SqsMessageHandler(process.env.SQS_QUEUE_NAME ?? 'test-queue', false)
  async handleMessage(message: Message): Promise<void> {
    const event = JSON.parse(message.Body ?? '{}') as ProductEvent;

    switch (event.type) {
      case ProductEventType.Created:
        this.logger.log({
          event: event.type,
          id: event.id,
          name: event.name,
          price: event.price,
          timestamp: event.timestamp,
        });
        break;

      case ProductEventType.Deleted:
        this.logger.log({
          event: event.type,
          id: event.id,
          timestamp: event.timestamp,
        });
        break;

      default:
        this.logger.warn({ event: 'unknown', raw: message.Body });
    }
  }
}
