import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './service/app-config.service';

const providers = [AppConfigService];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class SharedModule {}
