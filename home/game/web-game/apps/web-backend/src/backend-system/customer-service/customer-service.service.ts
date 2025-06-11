import { Body, Injectable } from '@nestjs/common';
import { webApiConstants } from 'apps/web-game/src/common/auth/constants';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { cloneDeep } from 'lodash';
import { EBActType } from '../../backend-enum';
import { languageConfig } from '../../config/language/language';
import { BackendDataService } from '../../data/backend-data/backend-data.service';
import { BaseResult, RechargeInfoResult } from '../../result/result';
import { RechargeInfoDto, RechargeRankDto, UpdateRoleStatusDto } from './dto/customer-service.dto';
import { RechargeInfoEntity } from './entities/customer-service.entity';


@Injectable()
export class CustomerServiceService {
	constructor(private readonly backendDate: BackendDataService,
	) { }

	async getRechargeInfo(rechargeInfoDto: RechargeInfoDto) {
		let prismaBackendDB = this.backendDate.getPrismaBackendDB();
		let result = new RechargeInfoResult();
		let whereCondition = {
			gameId: rechargeInfoDto.gameid,
			serverId: rechargeInfoDto.serverid,
		};
		if (rechargeInfoDto.roleid != "") {
			whereCondition = Object.assign(
				whereCondition, {
				gameRoleId: rechargeInfoDto.roleid,
			}
			)
		}
		if (rechargeInfoDto.paid !== undefined && (rechargeInfoDto.paid === 0 || rechargeInfoDto.paid === 1)) {
			whereCondition = Object.assign(
				whereCondition, {
				paid: rechargeInfoDto.paid,
			}
			)
		}
		if (rechargeInfoDto.delivered !== undefined && (rechargeInfoDto.delivered === 0 || rechargeInfoDto.delivered === 1)) {
			whereCondition = Object.assign(
				whereCondition, {
				delivered: rechargeInfoDto.delivered,
			}
			)
		}
		let page = rechargeInfoDto.page;
		let pageSize = rechargeInfoDto.pagesize;
		let param = {
			where: whereCondition,
			skip: (page - 1) * pageSize,
			take: pageSize,
		};
		let totalCount = await prismaBackendDB.orders.count({
			where: whereCondition
		})
		let ret = await prismaBackendDB.orders.findMany(param)

		if (!ret) {
			console.error("getRechargeInfo is error");
		}
		for (let index = 0; index < ret.length; index++) {
			let element = ret[index];
			if (element.paidTime) {
				element.paidTime = (cTools.newTransformToUTCZDate(element.paidTime));
			}
			element.createdAt = (cTools.newTransformToUTCZDate(element.createdAt));
			element.updatedAt = (cTools.newTransformToUTCZDate(element.updatedAt));

		}
		let infodata = new RechargeInfoEntity();
		infodata.info = ret;
		infodata.totalpages = totalCount; //Math.ceil(totalCount / pageSize);
		result.data = infodata;
		languageConfig.setSuccess(EBActType.GetRechargeInfo, result);
		// console.log(result)
		return result;
	}


	async updateRoleStatus(@Body() updateRoleStatusDto: UpdateRoleStatusDto) {

		let baseResult = new BaseResult();
		let prismaBackendDB = this.backendDate.getPrismaBackendDB();

		let game_ret = await prismaBackendDB.games.findUnique(
			{
				where: {
					id: updateRoleStatusDto.gameid
				}
			}
		)

		if (!game_ret) {
			baseResult.msg = `该游戏不存在`;
			return baseResult;
		}

		let server_ret = await prismaBackendDB.servers.findFirst(
			{
				where: {
					gameId: updateRoleStatusDto.gameid,
					serverId: updateRoleStatusDto.serverid
				}
			}
		)

		if (!server_ret) {
			baseResult.msg = `该游戏服不存在`;
			return baseResult;
		}

		updateRoleStatusDto.time = new Date().getTime();
		let sgin = `${updateRoleStatusDto.gameid}${updateRoleStatusDto.serverid}${updateRoleStatusDto.roleid}${webApiConstants.secret}${updateRoleStatusDto.status}${updateRoleStatusDto.time}`;
		let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();

		let send_data = Object.assign({}, cloneDeep(updateRoleStatusDto), {
			key: sgin_md5,
		})

		let url = server_ret.gameUrl + "/game-common/updateRoleStatus";
		let send_ret = await this.backendDate.sendHttpPost(url, send_data);

		languageConfig.setFail(EBActType.UpdateRoleStatus, baseResult);
		if (send_ret && send_ret.data) {

			if (send_ret.data.ok) {
				languageConfig.setSuccess(EBActType.UpdateRoleStatus, baseResult);
			}
			else {
				if (send_ret.data.msg) {
					baseResult.msg = send_ret.data.msg
				}
			}
		}
		return baseResult;
	}


	async getRechargeRank(dto: RechargeRankDto) {
		let prismaBackendDB = this.backendDate.getPrismaBackendDB();
		let result = new RechargeInfoResult();
		let whereCondition = {
			gameId: dto.gameid,
			serverId: dto.serverid,
			paid: 1, //已支付
		};
		let param = {
			where: whereCondition,

		};
		let ret = await prismaBackendDB.orders.findMany(param)
		let obj_ret = {}
		for (let index = 0; index < ret.length; index++) {
			let d = ret[index];
			let base = {
				serverId: d.serverId,
				gameId: d.gameId,
				gameRoleName: d.gameRoleName,
				gameUserId: d.gameUserId,
				gameRoleId: d.gameRoleId,
				all_num: 0
			}
			obj_ret[d.gameRoleId] = obj_ret[d.gameRoleId] || base;
			obj_ret[d.gameRoleId].all_num += d.paidAmount;

		}

		let allret:any[] = Object.values(obj_ret)
		allret.sort(function (a, b) {
			return b.all_num - a.all_num;
		})
		let rankdata=[]
		for (let index = 0; index < allret.length; index++) {
			let element = allret[index];
			rankdata.push(element)
			if (index + 1 >= dto.count) {
				break;
			}
		}
		let infodata = new RechargeInfoEntity();
		infodata.info = rankdata;
		result.data = infodata;
		languageConfig.setSuccess(EBActType.GetRechargeRank, result);
		// console.log(result)
		return result;
	}


}
