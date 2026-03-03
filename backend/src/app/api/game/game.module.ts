import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../user/user.entity';
import { GameService } from './game.service';
import { GameGateway } from './webservice/game.gateway';
import { AuthModule } from '../auth/auth.module';
import { GameController } from './webservice/game.controller';

@Module({
  imports: [MikroOrmModule.forFeature([User]), AuthModule],
  providers: [GameService, GameGateway],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
