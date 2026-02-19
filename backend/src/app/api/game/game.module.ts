import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../user/user.entity';
import { GameService } from './game.service';
import { GameGateway } from './webservice/game.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MikroOrmModule.forFeature([User]), AuthModule],
  providers: [GameService, GameGateway],
  controllers: [],
  exports: [GameService],
})
export class GameModule {}
