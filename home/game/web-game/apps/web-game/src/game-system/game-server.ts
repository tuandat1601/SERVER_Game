import { TableGameConfig } from '../config/gameTable/TableGameConfig';
import { TableGameSys } from '../config/gameTable/TableGameSys';
import { ArenaServerInfo } from '../game-data/entity/arena.entity';
import { PirateShipRoleEntity, SPirateShipEntity, SPSRankEntity } from '../game-data/entity/pirateShip.entity';
import { RoleInfoEntity, RoleSubInfoEntity } from '../game-data/entity/roleinfo.entity';
import { ServerSubInfoEntity } from '../game-data/entity/server-info.entity';
import { cTools } from '../game-lib/tools';
import { cGameCommon, RetRoleALLInfo } from './game-common';
import { WrestleServerInfo } from './wrestle/entities/wrestle.entity';

export const cGameServer = {
  /**
   * 服务器-检测系统是否开放
   */
  isOpenSystem(serverSubInfoEntity: ServerSubInfoEntity, systemId: number) {
    if (!TableGameSys.checkHave(systemId)) {
      return false;
    }

    if (!serverSubInfoEntity || !serverSubInfoEntity.startTime) {
      return false;
    }

    let tableGameSys_table = new TableGameSys(systemId);

    let open_days = cTools.GetServerOpenDays(serverSubInfoEntity.startTime);
    if (open_days < tableGameSys_table.server_opendays) {
      return false;
    }

    //关闭
    //开服多少天关闭
    if (tableGameSys_table.close_serverday && tableGameSys_table.close_serverday > 0) {
      if (open_days > tableGameSys_table.close_serverday) {
        return false;
      }
    }


    return true;
  },

  /**
   * 服务器-检测是否有新的系统开放
   */
  checkOpenNewSystem(serverSubInfoEntity: ServerSubInfoEntity) {

    if (!serverSubInfoEntity || !serverSubInfoEntity.startTime) { return; }

    let cur_system_id = -1;
    //夺宝大作战
    cur_system_id = TableGameSys.pirateShip;
    if (serverSubInfoEntity.pirateShip === undefined && cGameServer.isOpenSystem(serverSubInfoEntity, cur_system_id)) {
      serverSubInfoEntity.pirateShip = new SPirateShipEntity();
    }
    //竞技场
    cur_system_id = TableGameSys.arena;
    if (serverSubInfoEntity.arenaData === undefined && cGameServer.isOpenSystem(serverSubInfoEntity, cur_system_id)) {
      serverSubInfoEntity.arenaData = new ArenaServerInfo();
    }

    if (serverSubInfoEntity.arenaData) {
      if (serverSubInfoEntity.arenaData.sTime === undefined) {
        serverSubInfoEntity.arenaData.sTime = cTools.newLocalDate0String();
        delete serverSubInfoEntity.arenaData.rank;//这个排行榜单独存储
      }
      if (!serverSubInfoEntity.arenaData.season) {
        serverSubInfoEntity.arenaData.season = 1;
      }
    }

    //王者角斗
    cur_system_id = TableGameSys.wrestle;
    if (serverSubInfoEntity.WrestleData === undefined && cGameServer.isOpenSystem(serverSubInfoEntity, cur_system_id)) {
      serverSubInfoEntity.WrestleData = new WrestleServerInfo();
    }

  },



  /**
   * 修改排名
   * @param rolePirateShip 
   */
  changePSRank(retRoleALLInfo: RetRoleALLInfo) {


    if (!retRoleALLInfo.roleHero || !retRoleALLInfo.roleInfo) { return; }
    if (!retRoleALLInfo.serverInfo || !retRoleALLInfo.serverInfo.info) { return; }
    let spirateShip = retRoleALLInfo.serverInfo.info.pirateShip;
    if (!spirateShip) { return; }

    let newRank = function () {
      //直接进入
      let cur_rank = new SPSRankEntity();
      cur_rank.id = roleSubInfoEntity.roleid;
      cur_rank.c = roleSubInfoEntity.ico;  //"1";
      cur_rank.d = String(rolePirateShip.damage);
      // cur_rank.f = String(cGameCommon.cpRoleFightPoint(roleSubInfoEntity, retRoleALLInfo.roleHero));
      cur_rank.f = String(cGameCommon.getRoleFightPoint(retRoleALLInfo.roleHero));
      cur_rank.n = roleSubInfoEntity.name;

      return cur_rank;
    }

    let roleSubInfoEntity = retRoleALLInfo.roleSubInfo;
    let rolePirateShip = roleSubInfoEntity.pirateShip;

    let is_have = false;
    spirateShip.rank = spirateShip.rank || [];
    for (let index = 0; index < spirateShip.rank.length; index++) {
      let rank = spirateShip.rank[index];
      if (rank.id !== roleSubInfoEntity.roleid) { continue; }
      is_have = true;
      //在榜单内
      spirateShip.rank[index] = newRank();
    }

    //在榜单外
    if (!is_have) {
      spirateShip.rank.push(newRank());
    }

    //排序
    spirateShip.rank.sort(function (a, b) {

      if (!a || !a.d || !a.t) { return 1; }

      if (!b || !b.d || !b.t) { return -1; }

      if (a.d !== b.d) {
        return Number(b.d) - Number(a.d);
      }

      let atime = new Date(a.t).getTime();
      let btime = new Date(b.t).getTime();

      return atime - btime;

    });

    //自己的排名
    for (let index = 0; index < spirateShip.rank.length; index++) {
      let rank = spirateShip.rank[index];
      if (rank.id !== roleSubInfoEntity.roleid) { continue; }
      rolePirateShip.rank = index + 1;
    }


    if (spirateShip.rank.length > TableGameConfig.ps_rank_max) {

      let delete_num = spirateShip.rank.length - TableGameConfig.ps_rank_max;
      spirateShip.rank.splice(TableGameConfig.ps_rank_max, delete_num);

    }

  },

  /**
 * 修改排名
 * @param rolePirateShip 
 */
  changePSRankIco(retRoleALLInfo: RetRoleALLInfo, roleid: string, data: any) { //ico: string


    if (!retRoleALLInfo.serverInfo || !retRoleALLInfo.serverInfo.info) { return; }
    let spirateShip = retRoleALLInfo.serverInfo.info.pirateShip;
    if (!spirateShip) { return; }

    spirateShip.rank = spirateShip.rank || [];
    for (let index = 0; index < spirateShip.rank.length; index++) {
      let rank = spirateShip.rank[index];
      if (rank.id !== roleid) { continue; }
      //在榜单内
      if (data.ico) {
        spirateShip.rank[index].c = data.ico;
      }
      if (data.name) {
        spirateShip.rank[index].n = data.name;
      }
    }

  },
};
