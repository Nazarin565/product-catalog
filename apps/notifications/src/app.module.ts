import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [TerminusModule, NotificationsModule],
  controllers: [HealthController],
})
export class AppModule {}
