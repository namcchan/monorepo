import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './shared/service/app-config.service';
import { HealthCheckModule } from './modules/health-check/health-check.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    DatabaseModule,
    HealthCheckModule,
  ],
  providers: [],
})
export class AppModule {}
