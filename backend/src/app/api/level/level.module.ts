import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';
import { LevelService } from './level.service';
import { LevelController } from './webservice/level.controller';
import { GameModule } from '../game/game.module';

@Module({
  imports: [MikroOrmModule.forFeature([User]), AuthModule, GameModule],
  providers: [LevelService],
  controllers: [LevelController],
  exports: [LevelService],
})
export class LevelModule {}
