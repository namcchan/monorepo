import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ServiceHealthIndicator } from './health-indicator';
import { HealthCheckerController } from './health-check.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckerController],
  providers: [ServiceHealthIndicator],
})
export class HealthCheckModule {}
