import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { UserModule } from './app/api/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './app/api/health/health.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    MikroOrmModule.forRoot(mikroOrmConfig),
    UserModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
