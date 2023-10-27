import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { AppConfigService } from '../shared/service/app-config.service';

@Global()
@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => config.postgres,
    }),
  ],
})
export class DatabaseModule {}
