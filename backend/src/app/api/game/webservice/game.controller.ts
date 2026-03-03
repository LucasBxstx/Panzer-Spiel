import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../common/decorators/current-user.decorator';
import { LobbyPreviewResponseDto } from '../../lobby/webservice/dto/lobby-response.dto';
import { GameService } from '../game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMyGame(
    @CurrentUserId() id: string,
  ): Promise<LobbyPreviewResponseDto | null> {
    return this.gameService.getMyRunningGame(id);
  }
}
