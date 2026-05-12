import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from './database/database.module';
import { MessagingModule } from './messaging/messaging.module';
import { ProductsModule } from './products/products.module';
import { MetricsModule } from './metrics/metrics.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    DatabaseModule,
    MessagingModule,
    ProductsModule,
    MetricsModule,
    TerminusModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
