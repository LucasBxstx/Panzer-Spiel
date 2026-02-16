import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../user/user.entity';
import { GameService } from './game.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [GameService],
  controllers: [],
  exports: [GameService],
})
export class GameModule {}
