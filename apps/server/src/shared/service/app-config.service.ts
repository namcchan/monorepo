import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from '../../snake-naming.strategy';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replaceAll('\\n', '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }
  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  get postgres(): TypeOrmModuleOptions {
    const entities = [__dirname + '/../../entities/*.entity{.ts,.js}'];
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

    return {
      entities,
      migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'postgres',
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      migrationsRun: false,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get auth() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get awsS3() {
    return {
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get nats() {
    return {
      isEnabled: this.getBoolean('NATS_ENABLED'),
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get app() {
    return {
      port: this.getString('PORT'),
    };
  }
}
