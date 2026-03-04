import { LobbyService } from '../lobby.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../common/decorators/current-user.decorator';
import { LobbyPreviewResponseDto } from './dto/lobby-response.dto';
import { MapPreviewResponseDto } from '../../../common/dtos/map-preview-response.dto';

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUserId() id: string): Promise<LobbyPreviewResponseDto[]> {
    return this.lobbyService.findAll(id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('available-maps')
  getAvailableMaps(): MapPreviewResponseDto[] {
    return this.lobbyService.getAvailableMaps();
  }
}
