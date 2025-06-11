import { ApiProperty } from '@nestjs/swagger';
import { EBServerStatus } from 'apps/web-backend/src/backend-enum';
import { cTools } from '../../game-lib/tools';
import { RetRoleALLInfo } from '../../game-system/game-common';
import { WrestleServerInfo } from '../../game-system/wrestle/entities/wrestle.entity';
import { ArenaServerInfo } from './arena.entity';
import { HerosRecord } from './hero.entity';

import { SPirateShipEntity } from './pirateShip.entity';

/**服务器全局子INFO数据 */
export class ServerSubInfoEntity {
  /**开服时间 */
  @ApiProperty({ description: '开服时间' })
  startTime?: string;

  /**每日重置时间 */
  @ApiProperty({ description: '每日重置时间' })
  resetTime?: string;

  /**夺宝大作战 数据结构 */
  @ApiProperty({ description: '夺宝大作战 数据结构' })
  pirateShip?: SPirateShipEntity;

  /**竞技场 数据结构 */
  @ApiProperty({ description: '竞技场 数据结构' })
  arenaData?: ArenaServerInfo;

  /**王者角斗 数据结构 */
  @ApiProperty({ description: '王者角斗 数据结构' })
  WrestleData?: WrestleServerInfo;

  /**服务器状态 */
  @ApiProperty({ description: '服务器状态' })
  status?: EBServerStatus;


  /**深渊巨龙 昨日排名 roleid,rank */
  ad_lrank?: Record<number, number>;

  /**合服时间 */
  @ApiProperty({ description: '合服时间' })
  mergeTime?: string;

  /**合服次数 */
  @ApiProperty({ description: '合服次数' })
  mergeNum?: number;

  /**合服信息 */
  @ApiProperty({ description: '合服信息 已被合服的服务器ID记录' })
  mergeServer?: number[];

  /**跨服ID */
  crossServerId?: number;
}

/**服务器全局数据 */
export class ServerInfoEntity {
  id?: number
  serverid: number
  info: ServerSubInfoEntity
  nodeid: number
  updatedAt: Date | string
}
