import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../user/user.entity';
import { LobbyService } from './lobby.service';
import { LobbyController } from './webservice/lobby.controller';
import { AuthModule } from '../auth/auth.module';
import { LobbyGateway } from './webservice/lobby.gateway';
import { GameModule } from '../game/game.module';

@Module({
  imports: [MikroOrmModule.forFeature([User]), AuthModule, GameModule],
  controllers: [LobbyController],
  providers: [LobbyService, LobbyGateway],
  exports: [LobbyService],
})
export class LobbyModule {}
