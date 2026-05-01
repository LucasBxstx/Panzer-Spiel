import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../common/decorators/current-user.decorator';
import { LevelService } from '../level.service';
import {
  LevelPreviewResponseDto,
  LevelResponseDto,
  StartLevelResponseDto,
} from './dto/level-response.dto';
import { PlayLevelDto } from './dto/level.dto';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('level-previews')
  async getAllLevelPreviews(
    @CurrentUserId() id: string,
  ): Promise<LevelPreviewResponseDto[]> {
    return await this.levelService.getAllLevelPreviews(id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':levelId')
  async getLevel(
    @CurrentUserId() userId: string,
    @Param('levelId') levelId: string,
  ): Promise<LevelResponseDto> {
    return await this.levelService.getLevel(Number(levelId), userId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post(':levelId')
  async startLevel(
    @CurrentUserId() userId: string,
    @Param('levelId') levelId: string,
    @Body() playLevelDto: PlayLevelDto,
  ): Promise<StartLevelResponseDto> {
    return await this.levelService.startLevel(
      Number(levelId),
      userId,
      playLevelDto,
    );
  }
}
