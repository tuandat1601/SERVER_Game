import { Injectable } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { EActType, EFightResults, EFightType, EGameRankType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameLevels } from '../../config/gameTable/TableGameLevels';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TableWrestleCard } from '../../config/gameTable/TableWrestleCard';
import { TableWrestleLevel } from '../../config/gameTable/TableWrestleLevel';
import { languageConfig } from '../../config/language/language';
import { FightReqEntity } from '../../game-data/entity/fight.entity';
import { HerosRecord } from '../../game-data/entity/hero.entity';
import { RESWrestleCardMsg, RESWrestleChgMsg, RESWrestleGetMsg, RESWrestlePKMsg } from '../../game-data/entity/msg.entity';
import { RoleInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { FightService } from '../fight/fight.service';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { cpHero } from '../hero/hero-cpattr';
import { cItemBag } from '../item/item-bag';
import { WrestleCardDto, WrestleChgDto, WrestleDto, WrestleGetDto } from './dto/wrestle.dto';
import { WrestleEntity } from './entities/wrestle.entity';

@Injectable()
export class WrestleService {
  constructor(
    private readonly gameDataService: GameDataService,
    private readonly fightService: FightService,
  ) { }

  /**更换对手 */
  async change(req: any, dto: WrestleChgDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let retMsg: RESWrestleChgMsg = new RESWrestleChgMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleItem = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.wrestle)) {
      retMsg.msg = languageConfig.tip.not_open_system;
      return retMsg;//系统是否开放
    }

    let wrestle = retRoleALLInfo.roleInfo.info.wrestle;
    if (!wrestle?.fight) {
      retMsg.msg = languageConfig.tip.error_system_data;
      return retMsg;//系统数据异常
    }

    const monster = TableWrestleLevel.getVal(wrestle.id, TableGameLevels.field_monster)
    let monAny = monster[wrestle.fight.daynum]
    if (!monAny) {
      retMsg.msg = '当日挑战次数不足';
      return retMsg;
    }

    let costItem = TableGameConfig.wrestle_change_cost
    cItemBag.costItem(retRoleALLInfo.roleItem, costItem, retMsg);
    if (!retMsg.ok) { return retMsg; }

    let rand = Math.floor(Math.random() * monAny.length)
    wrestle.fight.pkgroup = rand;
    retMsg.pkgroup = rand;
    //保存到内存
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
    await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);

    languageConfig.setActTypeSuccess(EActType.WRESTLE_CHANGE, retMsg);
    return retMsg;


  }

  /**角斗PK */
  async pk(req: any, dto: WrestleDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let retMsg: RESWrestlePKMsg = new RESWrestlePKMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    getRoleALLInfoDto.need_roleItem = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.wrestle)) {
      retMsg.msg = languageConfig.tip.not_open_system;
      return retMsg;//系统是否开放
    }

    let wrestle = retRoleALLInfo.roleInfo.info.wrestle;
    if (!wrestle?.fight) {
      retMsg.msg = languageConfig.tip.error_system_data;
      return retMsg;//系统数据异常
    }

    const tab = new TableWrestleLevel(wrestle.id)
    if (!tab.id) {
      retMsg.msg = languageConfig.tip.error_system_data;
      return retMsg;//系统数据异常
    }
    // wrestle.fight.daynum = 0
    let monAny = tab.monster[wrestle.fight.daynum]
    if (!monAny) {
      retMsg.msg = '当日挑战次数不足';
      return retMsg;
    }

    //第一轮初始战位
    if (dto.turns === 0) {

      //道具是否足够
      if (TableGameConfig.wrestle_pk_costitem && Object.keys(TableGameConfig.wrestle_pk_costitem).length > 0) {
        cItemBag.costItem(retRoleALLInfo.roleItem, TableGameConfig.wrestle_pk_costitem, retMsg);
        if (!retMsg.ok) { return retMsg; }
        await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
      }
      
      if (!dto.posorder || dto.posorder.length !== retRoleALLInfo.roleInfo.info.fteam.length) {
        retMsg.msg = '我方非法出战队伍'
        return retMsg;
      }
      wrestle.fight.posorder = dto.posorder;
      wrestle.fight.opos = 0;
      wrestle.fight.epos = 0;
      wrestle.fight.turns = 0;
      wrestle.fight.monhp = [];
    }
    else if (dto.turns !== wrestle.fight.turns) {
      retMsg.msg = '非法战斗' + dto.turns
      return retMsg;
    }
    let fightdto: FightReqEntity = {
      levels: wrestle.id,
      pos: dto.turns,
    }
    let isok = await this.fightService.goFight(EFightType.WRESTLE, roleKeyDto, retRoleALLInfo.roleInfo, fightdto, retRoleALLInfo.roleHero, retMsg)
    if (!isok) {
      return retMsg;
    }

    wrestle.fight.turns++
    let isOver = false;
    let exp: number = 0
    if (retMsg.results === EFightResults.WIN) {

      wrestle.fight.epos++
      if (monAny[wrestle.fight.pkgroup].length <= wrestle.fight.epos) {
        //怪打完了 处理掉落
        if (tab.drop && tab.drop.length > 0) {
          let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, tab.drop, this.gameDataService);
          cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
        }
        if (tab.drop2 && tab.drop2.length > 0) {
          let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, tab.drop2, this.gameDataService);
          cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
        }
        isOver = true;
        exp = tab.winexp
        wrestle.fight.wincount++
        //当日场次+1
        wrestle.fight.daynum++;
        exp *= (1 + wrestle.fight.wincount * (tab.expprob / 10000))
      }

    } else {
      wrestle.fight.opos++
      if (retRoleALLInfo.roleSubInfo.fteam.length <= wrestle.fight.opos) {
        isOver = true
        exp = -tab.loseexp
        wrestle.fight.wincount = 0
      }
    }
    if (isOver) {
      //对战轮数置0
      wrestle.fight.turns = 0
      let isup = this.ckUpgrade(exp, retRoleALLInfo.roleInfo, retRoleALLInfo.roleHero, tab, retMsg)
      if (isup && wrestle.id >= TableGameConfig.w_rank_open) {
        await this.gameDataService.changeServerRankByType(retRoleALLInfo, EGameRankType.WRESTLE, wrestle.id);
      }
      retMsg.wrestle = wrestle
      retMsg.hero = retRoleALLInfo.roleHero
    }

    retMsg.turns = wrestle.fight.turns
    //保存到内存
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
    await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);

    languageConfig.setActTypeSuccess(EActType.WRESTLE_PK, retMsg);
    return retMsg;


  }

  /**检测升阶 */
  ckUpgrade(exp: number, roleInfo: RoleInfoEntity, roleHero: HerosRecord, tab: TableWrestleLevel, retMsg: RESWrestlePKMsg) {
    let isup = false;
    let wrestle = roleInfo.info.wrestle
    wrestle.exp = Math.floor(Math.max(0, wrestle.exp + exp))
    if (wrestle.exp >= tab.needexp) {
      isup = true;
      wrestle.id = tab.nextid
      wrestle.exp -= tab.needexp

      //属性
      for (const heroid in roleHero) {
        if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
          const heroEntity = roleHero[heroid];
          heroEntity.id = Number(heroid)
          cpHero.cpHeroAttr(heroEntity, roleInfo.info)
          retMsg.hero = retMsg.hero || {};
          retMsg.hero[heroid] = cloneDeep(heroEntity);
        }
      }
    }
    return isup
  }

  /**获取升阶奖励 */
  async getaward(req: any, dto: WrestleGetDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let retMsg: RESWrestleGetMsg = new RESWrestleGetMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    // getRoleALLInfoDto.need_roleItem = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.wrestle)) {
      retMsg.msg = languageConfig.tip.not_open_system;
      return retMsg;//系统是否开放
    }

    let wrestle = retRoleALLInfo.roleInfo.info.wrestle;
    if (!wrestle) {
      retMsg.msg = languageConfig.tip.error_system_data;
      return retMsg;//系统数据异常
    }
    wrestle.isget = wrestle.isget || []

    const tab = new TableWrestleLevel(dto.id)
    if (!tab.award) {
      retMsg.msg = '无此奖励'
      return retMsg;
    }
    if (wrestle.isget.includes(dto.id)) {
      retMsg.msg = '重复领取'
      return retMsg;
    }
    if (wrestle.id < dto.id) {
      retMsg.msg = '条件不足'
      return retMsg;
    }

    if (tab.award.length > 0) {
      let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, tab.award, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
      wrestle.isget.push(dto.id)
    }

    retMsg.isget = wrestle.isget
    //保存到内存
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

    languageConfig.setActTypeSuccess(EActType.WRESTLE_CHANGE, retMsg);
    retMsg.msg = '获取奖励成功'
    return retMsg;


  }

  /**装备属性卡 */
  async card(req: any, dto: WrestleCardDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let retMsg: RESWrestleCardMsg = new RESWrestleCardMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleItem = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.wrestle)) {
      retMsg.msg = languageConfig.tip.not_open_system;
      return retMsg;//系统是否开放
    }

    let wrestle = retRoleALLInfo.roleInfo.info.wrestle;
    if (!wrestle) {
      retMsg.msg = languageConfig.tip.error_system_data;
      return retMsg;//系统数据异常
    }
    if (!dto.cards) {
      retMsg.msg = 'cards err'
      return retMsg;
    }
    let cardslot = TableWrestleLevel.getVal(wrestle.id, TableWrestleLevel.field_cardslot)
    if (dto.cards.length > cardslot) {
      retMsg.msg = '卡槽不足'
      return retMsg;
    }
    let heroEntity = retRoleALLInfo.roleHero[String(dto.heroid)];
    if (!heroEntity) {
      retMsg.msg = 'heroid err'
      return retMsg;
    }

    //判断是否重复使用卡
    let isuse = []
    for (const key in retRoleALLInfo.roleHero) {
      if (Object.prototype.hasOwnProperty.call(retRoleALLInfo.roleHero, key)) {
        const element = retRoleALLInfo.roleHero[key];
        if (element.pkcards && element.pkcards.length > 0 && key != String(dto.heroid)) {
          isuse = isuse.concat(element.pkcards)
        }
      }
    }

    function compareArrays(arr1: number[], arr2: number[]): boolean {
      for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i] === Math.floor(arr2[j] / 100)) {
            return true;
          }
        }
      }
      return false;
    }
    if (compareArrays(dto.cards, isuse)) {
      retMsg.msg = '不可重复使用卡'
      return retMsg;
    }

    let pkcards: number[] = []
    for (let index = 0; index < dto.cards.length; index++) {
      const itemid = dto.cards[index];
      const num = retRoleALLInfo.roleItem[itemid] || 0
      if (num === 0) {
        retMsg.msg = 'cards err'
        return retMsg;
      }
      let tab = TableWrestleCard.getTable()
      let ispush = false;
      let maxid = 0;
      let maxnum = 0;
      for (const key in tab) {
        if (Object.prototype.hasOwnProperty.call(tab, key)) {
          const id = Number(key);
          const d: TableWrestleCard = tab[id];
          if (d.itemid == itemid) {
            if (d.itemnum == num) {
              pkcards.push(id)
              ispush = true;
              break;
            }
            else if (maxnum < d.itemnum) {
              maxnum = d.itemnum;
              maxid = id;
            }
          }

        }
      }
      if (!ispush && maxid !== 0) {
        pkcards.push(maxid)
      }
    }
    heroEntity.pkcards = pkcards

    //保存到内存
    // await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
    // await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
    await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);

    retMsg.cards = pkcards
    languageConfig.setActTypeSuccess(EActType.WRESTLE_CARD, retMsg);
    return retMsg;

  }


}
