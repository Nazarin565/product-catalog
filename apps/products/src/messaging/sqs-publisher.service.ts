import { Injectable, Logger } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { ProductEvent } from '@universe/shared';

@Injectable()
export class SqsPublisherService {
  private readonly logger = new Logger(SqsPublisherService.name);
  private readonly client: SQSClient;
  private readonly queueUrl: string;

  constructor() {
    this.client = new SQSClient({
      region: process.env.AWS_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'test',
      },
      ...(process.env.AWS_SQS_ENDPOINT && {
        endpoint: process.env.AWS_SQS_ENDPOINT,
      }),
    });

    this.queueUrl = `${process.env.AWS_SQS_ENDPOINT ?? 'https://sqs.us-east-1.amazonaws.com'}/000000000000/${process.env.SQS_QUEUE_NAME ?? 'test-queue'}`;
  }

  async publish(event: ProductEvent): Promise<void> {
    try {
      await this.client.send(
        new SendMessageCommand({
          QueueUrl: this.queueUrl,
          MessageBody: JSON.stringify(event),
        }),
      );
      this.logger.log(`Published event: ${event.type} [id=${event.id}]`);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${event.type}`, error);
      throw error;
    }
  }
}
