import { Module } from '@nestjs/common';
import { SqsPublisherService } from './sqs-publisher.service';

@Module({
  providers: [SqsPublisherService],
  exports: [SqsPublisherService],
})
export class MessagingModule {}
