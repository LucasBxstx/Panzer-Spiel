import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../user/user.entity';
import { LobbyService } from './lobby.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [],
  providers: [LobbyService],
  exports: [LobbyService]
})