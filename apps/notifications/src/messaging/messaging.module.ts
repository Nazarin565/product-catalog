import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';

const queueName = process.env.SQS_QUEUE_NAME ?? 'test-queue';
const sqsEndpoint = process.env.AWS_SQS_ENDPOINT ?? 'http://localhost:4566';

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'test',
  },
  endpoint: sqsEndpoint,
});

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: queueName,
          queueUrl: `${sqsEndpoint}/000000000000/${queueName}`,
          sqs: sqsClient,
        },
      ],
    }),
  ],
  exports: [SqsModule],
})
export class MessagingModule {}
