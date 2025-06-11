import { Delete, Injectable, Request, UseGuards } from '@nestjs/common';
import { clone } from 'lodash';
import { SnowflakeIdv1 } from 'simple-flakeid';
import { gameConst } from '../../config/game-const';
import { EActType, EEmailState } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameItem } from '../../config/gameTable/TableGameItem';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { languageConfig } from '../../config/language/language';
import { EmailAry, EmailEntity, EmailIds, EmailItemsEntity, EmailList, EmailSysEntity } from '../../game-data/entity/email.entity';
import { EquipEntityRecord, EquipEntity } from '../../game-data/entity/equip.entity';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { REMsg, RESChangeMsg, RESGetEmailMsg, RESReceiveEmailMsg } from '../../game-data/entity/msg.entity';
import { RoleEntity } from '../../game-data/entity/role.entity';
import { RoleInfoEntity, RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { GameDataService } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { Logger } from '../../game-lib/log4js';
import { cTools } from '../../game-lib/tools';
import { EquipService } from '../equip/equip.service';
import { cItemBag } from '../item/item-bag';
import { AutoDeleteEmailDto, AutoReadEmailDto, AutoReceiveEmailDto, DeleteEmailDto, GetEmailDto, ReadEmailDto, ReceiveEmailDto, SendEmailDto } from './dto/email-system.dto';

@Injectable()
export class EmailService {

  public snowflakeIdv1: SnowflakeIdv1;
  constructor(
    private readonly gameDataService: GameDataService,
  ) {
    const workerId = process.env.WORKER_ID == undefined ? 1 : Number(process.env.WORKER_ID)

    this.snowflakeIdv1 = new SnowflakeIdv1({
      workerId: workerId,
      workerIdBitLength: Number(process.env.emailid_workerIdBitLength),
      baseTime: Number(process.env.emailid_baseTime),
      seqBitLength: Number(process.env.emailid_eqBitLength),
    })
  }

  /**
   * 获取邮件列表
   * @param getEmailDto 
   * @returns 
   */
  async getData(@Request() req: any, getEmailDto: GetEmailDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let RESMsg: RESGetEmailMsg = {
      ok: false,
      msg: "RESGetEmailMsg is nil",
    }

    //个人邮件
    let emails: EmailList = await this.gameDataService.getRoleEmail(roleKeyDto);
    emails = emails || {};

    //全服邮件标记
    let roleSubInfo: RoleSubInfoEntity = await this.gameDataService.getRoleSubInfo(roleKeyDto);
    //全服邮件数据
    let server_email = await this.gameDataService.getGlobalEmail(roleKeyDto.serverid);
    //是否同步了新的全服邮件
    let is_update = false;

    let role_emailIds: EmailIds = roleSubInfo.email.ids;
    //全服邮件同步
    for (const eid in server_email) {
      if (Object.prototype.hasOwnProperty.call(server_email, eid)) {
        const emailEntity: EmailEntity = server_email[Number(eid)];
        if (emailEntity.state == EEmailState.Deleted) {
          continue;
        }

        if (emailEntity.id <= roleSubInfo.email.lasteid) {
          continue;
        }

        //新的全服邮件同步
        if (role_emailIds[Number(emailEntity.id)] === undefined) {
          is_update = true
          role_emailIds[Number(emailEntity.id)] = EEmailState.UNREAD;
          roleSubInfo.email.lasteid = Number(emailEntity.id);
        }
      }
    }

    //回复信息列表同步全服邮件
    for (const eid in role_emailIds) {
      if (Object.prototype.hasOwnProperty.call(role_emailIds, eid)) {
        const cur_eid = Number(eid);

        if (!server_email[cur_eid]) { continue };

        if (emails[cur_eid]) { continue };

        if (role_emailIds[cur_eid] === EEmailState.Deleted) { continue };

        emails[cur_eid] = clone(server_email[cur_eid]);
        emails[cur_eid].state = role_emailIds[cur_eid];
      }
    }

    if (!emails || Object.keys(emails).length === 0) {
      RESMsg.msg = "emails is empty";
      RESMsg.emails = [];
      RESMsg.srctype = EActType.EMAIL_GETDATA;
      RESMsg.ok = true;
      RESMsg.msg = languageConfig.actTypeSuccess(RESMsg.srctype);
      return RESMsg;
    }

    //邮件不能超过上限
    let ret_email: EmailAry = [];
    for (const eid in emails) {
      if (Object.prototype.hasOwnProperty.call(emails, eid)) {
        ret_email.push(emails[eid])
      }
    }

    //排序
    ret_email.sort(function (a, b) {

      if (!a || !a.id) {
        return 1;
      }

      if (!b || !b.id) {
        return -1;
      }

      return Number(b.id) - Number(a.id);

    });

    //裁切
    if (ret_email.length > TableGameConfig.email_max_num) {
      ret_email = ret_email.slice(0, TableGameConfig.email_max_num);
    }

    if (is_update) {
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfo });
    }


    RESMsg.srctype = EActType.EMAIL_GETDATA;
    RESMsg.ok = true;
    RESMsg.msg = languageConfig.actTypeSuccess(RESMsg.srctype);
    RESMsg.emails = ret_email;
    return RESMsg;
  }

  /**
   * 已读邮件
   * @param getEmailDto 
   * @returns 
   */
  async read(@Request() req: any, readEmailDto: ReadEmailDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let RESMsg: REMsg = {
      ok: false,
      msg: "email read is nil",
    }

    let emails: EmailList = await this.gameDataService.getRoleEmail(roleKeyDto);

    if (!emails) {
      RESMsg.msg = "emails is nil";
      return RESMsg;
    }

    //全服邮件
    let roleSubInfo: RoleSubInfoEntity = await this.gameDataService.getRoleSubInfo(roleKeyDto);
    let cur_emailEntity: EmailEntity = emails[readEmailDto.id];

    let cur_email_state: number = null;
    let is_global = false;
    if (cur_emailEntity) {
      cur_email_state = cur_emailEntity.state;
    }
    else if (roleSubInfo.email.ids[readEmailDto.id] != undefined && roleSubInfo.email.ids[readEmailDto.id] >= 0) {
      is_global = true;
      cur_email_state = roleSubInfo.email.ids[readEmailDto.id];
    }
    else {
      RESMsg.msg = "邮件不存在！";
      return RESMsg;
    }

    if (cur_email_state === EEmailState.UNREAD) {
      cur_email_state = EEmailState.READ;
    } else {
      RESMsg.msg = "邮件已读！";
      return RESMsg;
    }

    if (is_global) {
      roleSubInfo.email.ids[readEmailDto.id] = cur_email_state;
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfo });
    }
    else {
      cur_emailEntity.needSave = true;
      cur_emailEntity.state = cur_email_state;
      await this.gameDataService.updateRoleEmail(roleKeyDto, emails);
    }



    RESMsg.srctype = EActType.EMAIL_READ;
    RESMsg.ok = true;
    RESMsg.msg = languageConfig.actTypeSuccess(RESMsg.srctype);
    return RESMsg;
  }

  /**
   * 一键已读邮件
   * @param getEmailDto 
   * @returns 
   */
  async autoRead(@Request() req: any, autoReadEmailDto: AutoReadEmailDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let RESMsg: REMsg = {
      ok: false,
      msg: "email read is nil",
    }

    let emails: EmailList = await this.gameDataService.getRoleEmail(roleKeyDto);

    if (!emails) {
      RESMsg.msg = "emails is nil";
      return RESMsg;
    }



    let update_role = false;
    let update_global = false;

    if (Object.keys(emails).length > 0) {
      for (const key in emails) {
        if (Object.prototype.hasOwnProperty.call(emails, key)) {
          let emailEntity: EmailEntity = emails[key];

          if (emailEntity.state === EEmailState.UNREAD) {
            emailEntity.state = EEmailState.READ;
            emailEntity.needSave = true;
            update_role = true;
            RESMsg.ok = true;
          }
        }
      }
    }

    //全服邮件
    let roleSubInfo: RoleSubInfoEntity = await this.gameDataService.getRoleSubInfo(roleKeyDto);
    for (const eid in roleSubInfo.email.ids) {
      if (Object.prototype.hasOwnProperty.call(roleSubInfo.email.ids, eid)) {
        let email_state = roleSubInfo.email.ids[Number(eid)];
        if (email_state === EEmailState.UNREAD) {
          roleSubInfo.email.ids[Number(eid)] = EEmailState.READ;
          update_global = true;
          RESMsg.ok = true;
        }
      }
    }



    if (!RESMsg.ok) {
      RESMsg.msg = "没有可读邮件";
      return RESMsg;
    }

    if (update_role) {
      await this.gameDataService.updateRoleEmail(roleKeyDto, emails);
    }
    if (update_global) {
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfo });
    }


    RESMsg.srctype = EActType.EMAIL_AUTOREAD;
    RESMsg.ok = true;
    RESMsg.msg = languageConfig.actTypeSuccess(RESMsg.srctype);
    return RESMsg;
  }

  async receiveItems(cur_emailEntity: EmailEntity, RESMsg: RESChangeMsg, equipBagRecord: EquipEntityRecord, roleItemBag: ItemsRecord) {

    if (!cur_emailEntity) {
      return false;
    }

    for (let index = 0; index < cur_emailEntity.items.length; index++) {
      let emailItemsEntity: EmailItemsEntity = cur_emailEntity.items[index];
      if (emailItemsEntity.q) {
        //生成装备
        for (let index = 0; index < emailItemsEntity.n; index++) {
          let equip_entity: EquipEntity = this.gameDataService.createEquip(emailItemsEntity.i, emailItemsEntity.q);

          let equip_num = Object.keys(equipBagRecord).length;
          let equip_bag_num = TableGameConfig.equip_bag_max - equip_num;
          if (equip_bag_num <= 0) {
            return false;
          }

          if (equip_entity) {
            RESMsg.addEquip = RESMsg.addEquip || {}
            let eid = equip_entity.eid;
            delete equip_entity.eid;

            RESMsg.addEquip[eid] = equip_entity;
            equipBagRecord[eid] = equip_entity;
          }
        }
        RESMsg.ok = true;
      }
      else if (emailItemsEntity.einfo) {
        //已生成的装备对象
        let equip_entity: EquipEntity = emailItemsEntity.einfo;
        let equip_num = Object.keys(equipBagRecord).length;
        let equip_bag_num = TableGameConfig.equip_bag_max - equip_num;
        if (equip_bag_num <= 0) {
          return false;
        }

        if (!equipBagRecord[equip_entity.eid]) {
          let eid = equip_entity.eid;
          delete equip_entity.eid;
          RESMsg.addEquip = RESMsg.addEquip || {};
          RESMsg.addEquip[eid] = equip_entity;
          equipBagRecord[eid] = equip_entity;
          RESMsg.ok = true;
        }
        else {
          Logger.error("receive emailItemsEntity.einfo eid is have", emailItemsEntity.einfo);
        }
      }
      else {
        //道具
        if (TableGameItem.getVal(emailItemsEntity.i, TableGameItem.field_level)) {
          RESMsg.additem = RESMsg.additem || {}
          cItemBag.addItem(roleItemBag, RESMsg.additem, Number(emailItemsEntity.i), Number(emailItemsEntity.n));
          RESMsg.ok = true;
        }
        else {
          Logger.error("receive item is error", emailItemsEntity.i);
        }
      }

    }

  }


  /**
   * 领取附件
   * @param receiveEmailDto 
   * @returns 
   */
  async receive(@Request() req: any, receiveEmailDto: ReceiveEmailDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let RESMsg: RESReceiveEmailMsg = {
      ok: false,
      msg: "email receive is nil",
    }

    let emails: EmailList = await this.gameDataService.getRoleEmail(roleKeyDto);

    if (!emails) {
      RESMsg.msg = "emails is nil";
      return RESMsg;
    }

    let cur_emailEntity: EmailEntity = emails[receiveEmailDto.id];
    //全服邮件
    let roleSubInfo: RoleSubInfoEntity = await this.gameDataService.getRoleSubInfo(roleKeyDto);
    let server_email: EmailList = await this.gameDataService.getGlobalEmail(roleKeyDto.serverid);
    let cur_email_state: EEmailState;

    let update_global = false;
    if (cur_emailEntity) {
      cur_email_state = cur_emailEntity.state;
    }
    else if (server_email[receiveEmailDto.id] != undefined && roleSubInfo.email.ids[receiveEmailDto.id] != undefined) {
      cur_emailEntity = server_email[receiveEmailDto.id];
      cur_email_state = roleSubInfo.email.ids[receiveEmailDto.id];
      update_global = true;
    } else {
      RESMsg.msg = "邮件不存在！";
      return RESMsg;
    }

    if (cur_email_state >= EEmailState.RECEIVED) {
      RESMsg.msg = "邮件已经领取";
      return RESMsg;
    }

    if (cur_emailEntity.items === undefined || Object.keys(cur_emailEntity.items).length === 0) {
      RESMsg.msg = "没有可以领取的邮件";
      return RESMsg;
    }

    //获取道具数据
    let roleItemBag: ItemsRecord = await this.gameDataService.getRoleItemInfo(roleKeyDto);
    if (!roleItemBag) {
      RESMsg.msg = "roleIemBag is nil";
      return RESMsg;
    }
    //获取装备数据
    let equipBagRecord = await this.gameDataService.getRoleEquipInfo(roleKeyDto);
    if (!equipBagRecord) {
      RESMsg.msg = "equipBagRecord is nil";
      return RESMsg;
    }

    cur_email_state = EEmailState.RECEIVED;
    this.receiveItems(cur_emailEntity, RESMsg, equipBagRecord, roleItemBag);

    if (!RESMsg.ok) {
      RESMsg.msg = "没有附件可领取";
      return RESMsg;
    }


    if (update_global) {
      roleSubInfo.email.ids[receiveEmailDto.id] = cur_email_state;
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfo });
    }
    else {
      cur_emailEntity.needSave = true;
      cur_emailEntity.state = cur_email_state;
      await this.gameDataService.updateRoleEmail(roleKeyDto, emails);
    }

    await this.gameDataService.updateRoleItem(roleKeyDto, roleItemBag);
    await this.gameDataService.updateRoleEquip(roleKeyDto, equipBagRecord);

    RESMsg.srctype = EActType.EMAIL_RECEIVE;
    RESMsg.msg = languageConfig.actTypeSuccess(RESMsg.srctype);
    return RESMsg;
  }

  /**
   * 一键领取附件
   * @param getEmailDto 
   * @returns 
   */
  async autoReceive(@Request() req: any, autoReceiveEmailDto: AutoReceiveEmailDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESMsg: RESReceiveEmailMsg = {
      ok: false,
      msg: "email autoReceive is nil",
    }

    let emails: EmailList = await this.gameDataService.getRoleEmail(roleKeyDto);

    if (!emails) {
      RESMsg.msg = "emails is nil";
      return RESMsg;
    }

    //获取道具数据
    let roleItemBag: ItemsRecord = await this.gameDataService.getRoleItemInfo(roleKeyDto);
    if (!roleItemBag) {
      RESMsg.msg = "roleIemBag is nil";
      return RESMsg;
    }
    //获取装备数据
    let equipBagRecord = await this.gameDataService.getRoleEquipInfo(roleKeyDto);
    if (!equipBagRecord) {
      RESMsg.msg = "equipBagRecord is nil";
      return RESMsg;
    }

    let update_role = false;
    let update_global = false;
    for (const eid in emails) {
      if (Object.prototype.hasOwnProperty.call(emails, eid)) {
        let cur_emailEntity: EmailEntity = emails[eid];
        if (cur_emailEntity.state < EEmailState.RECEIVED && cur_emailEntity.items) {
          cur_emailEntity.state = EEmailState.RECEIVED;
          cur_emailEntity.needSave = true;
          update_role = true;
          this.receiveItems(cur_emailEntity, RESMsg, equipBagRecord, roleItemBag);
        }
      }
    }

    let roleSubInfo: RoleSubInfoEntity = await this.gameDataService.getRoleSubInfo(roleKeyDto);
    let server_email: EmailList = await this.gameDataService.getGlobalEmail(roleKeyDto.serverid);
    for (const eid in roleSubInfo.email.ids) {
      if (Object.prototype.hasOwnProperty.call(roleSubInfo.email.ids, eid)) {
        let cur_state: EEmailState = roleSubInfo.email.ids[Number(eid)];
        if (cur_state < EEmailState.RECEIVED && server_email[Number(eid)] && server_email[Number(eid)].items) {
          roleSubInfo.email.ids[Number(eid)] = EEmailState.RECEIVED;
          update_global = true;
          this.receiveItems(server_email[Number(eid)], RESMsg, equipBagRecord, roleItemBag);
        }
      }
    }

    if (!RESMsg.ok) {
      RESMsg.msg = "没有附件可领取";
      return RESMsg;
    }

    if (update_global) {
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfo });
    }

    if (update_role) {
      await this.gameDataService.updateRoleEmail(roleKeyDto, emails);
    }

    await this.gameDataService.updateRoleItem(roleKeyDto, roleItemBag);
    await this.gameDataService.updateRoleEquip(roleKeyDto, equipBagRecord);

    RESMsg.srctype = EActType.EMAIL_AUTORECEIVE;
    RESMsg.ok = true;
    RESMsg.msg = languageConfig.actTypeSuccess(RESMsg.srctype);
    return RESMsg;
  }

  /**
   * 删除邮件
   * @param getEmailDto 
   * @returns 
   */
  async delete(@Request() req: any, deleteEmailDto: DeleteEmailDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let RESMsg: RESReceiveEmailMsg = {
      ok: false,
      msg: "email delete is nil",
    }

    let emails: EmailList = await this.gameDataService.getRoleEmail(roleKeyDto);

    if (!emails) {
      RESMsg.msg = "emails is nil";
      return RESMsg;
    }

    let cur_emailEntity: EmailEntity = emails[deleteEmailDto.id];
    let roleSubInfo: RoleSubInfoEntity = await this.gameDataService.getRoleSubInfo(roleKeyDto);
    let server_email: EmailList = await this.gameDataService.getGlobalEmail(roleKeyDto.serverid);
    let cur_email_state: EEmailState;

    let update_global = false;
    if (cur_emailEntity) {
      cur_email_state = cur_emailEntity.state;
    }
    else if (server_email[deleteEmailDto.id] != undefined && roleSubInfo.email.ids[deleteEmailDto.id] != undefined) {
      cur_email_state = roleSubInfo.email.ids[deleteEmailDto.id];
      update_global = true
    }
    else {
      RESMsg.msg = "邮件不存在！";
      return RESMsg;
    }

    if (cur_email_state === EEmailState.Deleted) {
      RESMsg.msg = "邮件已删除！";
      return RESMsg;
    }

    if (cur_email_state < EEmailState.RECEIVED) {

      let is_have_items = false;
      if (update_global && server_email[deleteEmailDto.id].items != undefined && server_email[deleteEmailDto.id].items.length > 0) {
        is_have_items = true;
      }
      else if (cur_emailEntity != undefined && cur_emailEntity.items != undefined && cur_emailEntity.items.length > 0) {
        is_have_items = true;
      }

      if (is_have_items) {
        RESMsg.msg = "附件还未领取";
        return RESMsg;
      }

    }

    cur_email_state = EEmailState.Deleted;

    if (update_global) {
      delete roleSubInfo.email.ids[deleteEmailDto.id];
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfo });
    }
    else {
      cur_emailEntity.needSave = true;
      cur_emailEntity.state = cur_email_state;
      await this.gameDataService.updateRoleEmail(roleKeyDto, emails);
    }

    RESMsg.srctype = EActType.EMAIL_DELETE;
    RESMsg.ok = true;
    RESMsg.msg = languageConfig.actTypeSuccess(RESMsg.srctype);
    return RESMsg;
  }

  /**
   * 一键删除邮件
   * @param getEmailDto 
   * @returns 
   */
  async autoDelete(@Request() req: any, autoDeleteEmailDto: AutoDeleteEmailDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let RESMsg: RESReceiveEmailMsg = {
      ok: false,
      msg: "email delete is nil",
    }

    let emails: EmailList = await this.gameDataService.getRoleEmail(roleKeyDto);

    let roleSubInfo: RoleSubInfoEntity = await this.gameDataService.getRoleSubInfo(roleKeyDto);
    let server_email = await this.gameDataService.getGlobalEmail(roleKeyDto.serverid);
    if (!emails && Object.keys(roleSubInfo.email.ids).length === 0) {
      RESMsg.msg = "emails is nil";
      return RESMsg;
    }

    let update_role = false;
    let update_global = false;
    //个人邮件
    for (const eid in emails) {
      if (Object.prototype.hasOwnProperty.call(emails, eid)) {
        let cur_emailEntity: EmailEntity = emails[Number(eid)];
        if (!cur_emailEntity) {
          continue;
        }

        if (cur_emailEntity.state === EEmailState.Deleted) {
          continue;
        }

        if (cur_emailEntity.items && cur_emailEntity.items.length > 0 && cur_emailEntity.state < EEmailState.RECEIVED) {
          continue;
        }

        cur_emailEntity.state = EEmailState.Deleted;
        cur_emailEntity.needSave = true;
        update_role = true;
        RESMsg.ok = true;
      }
    }

    //全服
    let delete_ids = [];
    for (const eid in roleSubInfo.email.ids) {
      if (Object.prototype.hasOwnProperty.call(roleSubInfo.email.ids, eid)) {
        let cur_email_state = roleSubInfo.email.ids[eid];

        if (!server_email[eid]) {
          continue;
        }

        if (cur_email_state === EEmailState.Deleted) {
          continue;
        }

        if (server_email[eid].items && server_email[eid].items.length > 0 && cur_email_state < EEmailState.RECEIVED) {
          continue;
        }

        delete_ids.push(Number(eid));
        roleSubInfo.email.ids[eid] = EEmailState.Deleted;
        update_global = true;
        RESMsg.ok = true;
      }
    }

    if (!RESMsg.ok) {
      RESMsg.msg = "没有可以删除的邮件";
      return RESMsg;
    }

    if (update_global) {
      for (let index = 0; index < delete_ids.length; index++) {
        const eid = delete_ids[index];
        delete roleSubInfo.email.ids[eid];
      }
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfo });
    }

    if (update_role) {
      await this.gameDataService.updateRoleEmail(roleKeyDto, emails);
    }

    RESMsg.srctype = EActType.EMAIL_DELETE;
    RESMsg.ok = true;
    RESMsg.msg = languageConfig.actTypeSuccess(RESMsg.srctype);
    return RESMsg;
  }

  /**
   * 发送邮件
   */
  async sendEmail(sendEmailDto: SendEmailDto) {

    let retMsg = new REMsg();

    if (sendEmailDto.owner !== gameConst.email_globalTag) {
      let role = await this.gameDataService.getRole({ id: sendEmailDto.owner, serverid: sendEmailDto.serverid }, true, 1, false);

      if (!role) {
        retMsg.msg = "角色不存在";
        return retMsg;
      }
    }

    return this.gameDataService.sendEmail(sendEmailDto);

  }

}
