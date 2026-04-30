import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { UserModule } from './app/api/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './app/api/health/health.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './app/api/auth/auth.module';
import { LobbyModule } from './app/api/lobby/lobby.module';
import { GameModule } from './app/api/game/game.module';
import { LevelModule } from './app/api/level/level.module';

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
    AuthModule,
    LobbyModule,
    GameModule,
    LevelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
