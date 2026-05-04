import { BotSetting } from './bot.model';

export interface Level {
  id: number;
  name: string;
  mapId: string;
  botSettings: BotSetting[];
}
