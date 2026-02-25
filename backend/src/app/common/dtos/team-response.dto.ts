import { Expose, Type } from 'class-transformer';
import { PlayerResponseDto } from './player-response.dto';
import { Team } from '../models/team.model';
import { Player } from '../models/player.model';

export class TeamResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  color: string;

  @Expose()
  @Type(() => PlayerResponseDto)
  players: PlayerResponseDto[];

  static mapFromEntity(
    team: Team,
    players: Map<string, Player>,
  ): TeamResponseDto {
    return {
      id: team.id,
      name: team.name,
      color: team.color,
      players: Array.from(players.values())
        .filter((p) => p.teamId === team.id)
        .map((p) => PlayerResponseDto.mapFromEntity(p)),
    };
  }
}
