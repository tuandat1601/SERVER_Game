import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { clone } from 'lodash';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AuthService } from '../../common/auth/auth.service';
import { EActType } from '../../config/game-enum';
import { REMsg, RESChangeMsg, RESLoginMsg, RESSkillMsg, TitleMsg, FashionMsg } from '../../game-data/entity/msg.entity';
import { RoleEntity } from '../../game-data/entity/role.entity';
import { RoleInfoEntity, RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { Logger } from '../../game-lib/log4js';
import { cTools } from '../../game-lib/tools';
import { global_app } from '../../main';
import { Role } from '@prisma/client1';
import { cGameCommon, RetRoleALLInfo } from '../../game-system/game-common';
import { gameConst } from '../../config/game-const';
import { RoleAddExp, SetDailyEntity } from '../../game-data/entity/common.entity';
import { cTaskSystem, RetUpdateTask } from '../../game-system/task/task-sytem';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { languageConfig } from '../../config/language/language';
import { TaskExInfoEntity } from '../../game-data/entity/task.entity';
import { TitleService } from '../../game-system/title/title.service';
import { FashionService } from "../../game-system/fashion/fashion.service";

interface Response<T> {
  data: T
}

//拦截器
//Interceptor 则负责对成功请求结果进行包装：
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Promise<Response<T>>> {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<Response<T>>>> {

    const req = context.getArgByIndex(1).request;
    const now = Date.now();
    let is_show_accesslog = process.env.LOGGER_HTTPRES === "TRUE";

    const gameDataService = global_app.get(GameDataService);
    let roleKeyDto: RoleKeyDto;
    let role: Role;
    let retRoleALLInfo1: RetRoleALLInfo;
    if (req.user && req.url.indexOf("/login") === -1) {
      //获取角色信息
      roleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;
      getRoleALLInfoDto.need_roleItem = true;
      getRoleALLInfoDto.need_roleHero = true;
      retRoleALLInfo1 = await gameDataService.getRoleAllInfo(getRoleALLInfoDto);

      role = await gameDataService.getRole(roleKeyDto);
    }

    let resetDaily: SetDailyEntity = new SetDailyEntity();
    let is_rest_daily = false;
    //隔天重置 新的开服天数可能触发新系统开放
    let new_system: any
    //是否已经执行过
    let is_setUpdateDate = false;
    //非登录处理
    if (retRoleALLInfo1 && retRoleALLInfo1.isHaveData()) {
      let cur_time = cTools.newDate();
      let last_login_date = new Date(retRoleALLInfo1.roleSubInfo.lastlogintime);
      //每日重置处理
      let is_updateRoleInfo = false;

      if (cTools.isNewDay(last_login_date, cur_time)) {
        //隔天重置
        is_updateRoleInfo = true;
        is_rest_daily = true;
        //获取道具数据
        let roleIemBag: ItemsRecord = retRoleALLInfo1.roleItem;
        await gameDataService.resetDaily(retRoleALLInfo1, resetDaily, req);
        if (roleIemBag) { await gameDataService.updateRoleItem(roleKeyDto, roleIemBag); }

        new_system = cGameCommon.checkOpenNewSystem(retRoleALLInfo1);

      }

      //JWT 过期处理 
      const minutes = cTools.GetDateMinutesDiff(last_login_date, cur_time)
      if (minutes >= gameConst.jwt_outtime) {

        const authService = global_app.get(AuthService);
        let roleEntity: RoleEntity = {
          id: role.id,
          userid: role.userid,
          name: role.name,
          serverid: role.serverid,
          status: role.status,
        }
        retRoleALLInfo1.roleSubInfo.newGt = await authService.jwtSign(roleEntity);

        await gameDataService.saveRoleJWT(roleKeyDto, retRoleALLInfo1.roleSubInfo.newGt);
        is_updateRoleInfo = true;
      }

      if (is_updateRoleInfo) {
        retRoleALLInfo1.roleSubInfo.lastlogintime = cTools.newLocalDateString();
        await gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo1.roleSubInfo });
        await gameDataService.setUpdateDate(roleKeyDto);
        is_setUpdateDate = true
      }
    }

    let ret_data = next.handle().pipe(
      map(async (rawData) => {

        if (!req.user && rawData) {
          gameDataService.sendLog(req, rawData)
        }

        if (req.user && global_app && rawData) {
          let reMsg: REMsg = rawData;
          //日志处理
          gameDataService.sendLog(req, rawData)
          //新系统相关处理
          cGameCommon.setNewSystem(reMsg.roleAddExp?.newSystem, new_system, rawData, gameDataService, roleKeyDto, req)


          let retRoleALLInfo2: RetRoleALLInfo;
          if (req.user && req.url.indexOf("/login") === -1) {

            let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
            getRoleALLInfoDto.need_roleInfo = true;
            getRoleALLInfoDto.need_roleItem = true;
            getRoleALLInfoDto.need_roleHero = true;
            retRoleALLInfo2 = await gameDataService.getRoleAllInfo(getRoleALLInfoDto);
          }

          if (retRoleALLInfo2 && retRoleALLInfo2.isHaveData()) {
            let is_update_role = false;
            let is_update_item = false;
            let retUpdateTask: RetUpdateTask;
            let task_count = 1;
            let is_need_setUpdateDate = false;
            if (reMsg.taskCount !== undefined) {
              task_count = reMsg.taskCount;
            }
            if (rawData?.srctype && task_count > 0) {
              //任务处理

              let exinfo = new TaskExInfoEntity();

              if (rawData.additem) {
                exinfo.additem = rawData.additem;
              }

              if (rawData.roleAddExp && rawData.roleAddExp.newHero) {
                exinfo.roleAddExp = rawData.roleAddExp;
              }

              if (rawData.ts_buy_shopid && (rawData.srctype == EActType.SHOP_BUY_ITEM || rawData.srctype == EActType.SHOP_PAY_BUY_ITEM)) {
                exinfo.buy_shopid = rawData.ts_buy_shopid;
              }

              if (rawData.decEquip) {
                exinfo.sell_equip_num = Object.keys(rawData.decEquip).length;
              }

              if (rawData.decTmpEquip && rawData.decTmpEquip.length > 0) {
                exinfo.sell_equip_num = Object.keys(rawData.decTmpEquip).length;
              }



              if (rawData.ok) {
                retUpdateTask = cTaskSystem.updateTaskTag(rawData.srctype, retRoleALLInfo2, true, task_count, exinfo);
                is_need_setUpdateDate = true;
              }
              else {
                retUpdateTask = cTaskSystem.updateTaskTag(rawData.srctype, retRoleALLInfo2, false, task_count, exinfo);
              }

              if (retUpdateTask) {
                is_update_role = retUpdateTask.getIsUpdate();

                if (retUpdateTask.isUpdateTaskMain) {
                  reMsg.newTask = reMsg.newTask || {}
                  reMsg.newTask.newTaskMain = retRoleALLInfo2.roleSubInfo.taskMain;
                }

                if (retUpdateTask.isUpdateTaskDaily) {
                  reMsg.newTask = reMsg.newTask || {}
                  reMsg.newTask.newTaskDaily = retRoleALLInfo2.roleSubInfo.taskDaily;
                }

                if (retUpdateTask.isUpdateTaskGuild) {
                  reMsg.newTask = reMsg.newTask || {}
                  reMsg.newTask.newTaskGuild = retRoleALLInfo2.roleSubInfo.taskGuild;
                }

                if (retUpdateTask.isUpdateTaskUpgrade) {
                  reMsg.newTask = reMsg.newTask || {}
                  reMsg.newTask.newTaskUpgrade = retRoleALLInfo2.roleSubInfo.taskUpgrade;
                }

                if (retUpdateTask.isUpdateOpenWelfare) {
                  reMsg.newTask = reMsg.newTask || {}
                  reMsg.newTask.newTaskOpenWelfare = retRoleALLInfo2.roleSubInfo.openWelfare.tasklist;
                }

              }
            }

            //获取道具监听
            if (rawData.additem) {

              //开服福利
              if (retRoleALLInfo2.roleSubInfo?.openWelfare
                && cGameCommon.isOpenSystem(retRoleALLInfo2, TableGameSys.open_server_welfare)
                && rawData.additem[TableGameConfig.var_openWelfare_point] != undefined) {
                //计算总积分
                retRoleALLInfo2.roleSubInfo.openWelfare.totalPoint += rawData.additem[TableGameConfig.var_openWelfare_point];
                reMsg.openWelfareTPoint = retRoleALLInfo2.roleSubInfo.openWelfare.totalPoint;
                is_update_role = true;
              }

            }

            //小红点处理
            if (retRoleALLInfo2 && retRoleALLInfo2.roleSubInfo?.redDot) {
              reMsg.redDot = clone(retRoleALLInfo2.roleSubInfo.redDot);
              delete retRoleALLInfo2.roleSubInfo.redDot;
              is_update_role = true;
            }

            //jWT 过期处理
            if (retRoleALLInfo2 && retRoleALLInfo2.roleSubInfo?.newGt) {
              reMsg.newGt = retRoleALLInfo2.roleSubInfo.newGt;
              delete retRoleALLInfo2.roleSubInfo.newGt;
              is_update_role = true;
            }

            //隔天数值重置处理
            if (is_rest_daily) {
              reMsg.daily = resetDaily;
              //任务不要重复发送
              if (reMsg.newTask && reMsg.newTask.newTaskDaily) {
                delete reMsg.daily.taskDaiy;
              }
            }

            //登录触发 是否有新系统开放
            if (new_system) {
              reMsg.roleAddExp = new RoleAddExp();
              reMsg.roleAddExp.newSystem = new_system;
            }

            if (retRoleALLInfo2.roleInfo.info.title != undefined) {
              reMsg.expiredTitle = TitleService.expired(retRoleALLInfo2);
              if (reMsg.expiredTitle != undefined) { is_update_role = true; }
              if (rawData.additem) {
                let decitem = rawData.decitem || {};
                reMsg.attiveTitle = TitleService.itemAutoActive(retRoleALLInfo2, rawData.additem, decitem);
                if (reMsg.attiveTitle != undefined) {
                  is_update_role = true;
                  rawData.decitem = decitem;
                  is_update_item = false;
                }
              }
            }

            if (retRoleALLInfo2.roleInfo.info.fashion != undefined) {
              reMsg.expiredFashion = FashionService.expired(retRoleALLInfo2);
              if (reMsg.expiredFashion != undefined) { is_update_role = true; }
              if (rawData.additem) {
                let decitem = rawData.decitem || {};
                reMsg.attiveFashion = FashionService.itemAutoActive(retRoleALLInfo2, rawData.additem, decitem);
                if (reMsg.attiveFashion != undefined) {
                  is_update_role = true;
                  rawData.decitem = decitem;
                  is_update_item = true;
                }
              }
            }

            if (is_update_role) {
              await gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo2.roleInfo);
              await gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo2.roleHero);
              is_need_setUpdateDate = true;
            }

            if (is_update_item) {
              await gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo2.roleItem);
            }

            if (is_need_setUpdateDate && !is_setUpdateDate) {
              await gameDataService.setUpdateDate(roleKeyDto);
            }

            if (rawData.additem || rawData.decitem) {
              rawData.newitem = retRoleALLInfo2.roleItem;
            }
          }

        }

        if (is_show_accesslog) {
          let user = req.user || { "name": "system" };
          const logFormat = `<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            Request original url: ${req.url}
            Method: ${req.method}
            IP: ${req.headers["x-real-ip"]}
            User: ${JSON.stringify(user)}
            Diftime:${Date.now() - now}ms
            Response data:\n ${JSON.stringify(rawData)}\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
          //Logger.info(logFormat);

          if (rawData?.srctype) {
            if (gameConst.only_access_log[rawData.srctype] || cTools.getTestModel()) {
              Logger.access(logFormat);
            }
          }
          else {
            Logger.access(logFormat);
          }

        }

        if (rawData?.srctype) {
          delete rawData.srctype;
        }
        if (rawData?.taskCount) {
          delete rawData.taskCount;
        }

        return {
          data: rawData,
          code: 0,
          message: '请求成功',
        };
      }
      )
    )

    return ret_data;
  }
}