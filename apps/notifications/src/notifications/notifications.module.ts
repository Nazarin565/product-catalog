import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [MessagingModule],
  providers: [NotificationsService],
})
export class NotificationsModule {}
