import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { UserModule } from './app/api/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
