import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';
import { LevelService } from './level.service';
import { LevelController } from './webservice/level.controller';
import { GameService } from '../game/game.service';

@Module({
  imports: [MikroOrmModule.forFeature([User]), AuthModule],
  providers: [LevelService, GameService],
  controllers: [LevelController],
  exports: [LevelService],
})
export class LevelModule {}
