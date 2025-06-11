import { Injectable } from '@nestjs/common';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { BackendDataService } from '../../data/backend-data/backend-data.service';
import { ChannelFun } from '../channel.config';
import { SDKLoginCheckDto } from '../channel/entities/channel.entity';
import { YltaptapErrorCode, YltaptapRet } from './entities/yltaptap.entity';

@Injectable()
export class YltaptapService extends ChannelFun {
  constructor(
    private readonly backendDate: BackendDataService,
  ) {
    super();
  }

  async verifySDKLogin(sdkLoginCheckDto: SDKLoginCheckDto) {

    let send_data = {
      app_id: sdkLoginCheckDto.app_id,
      mem_id: sdkLoginCheckDto.mem_id,
      user_token: sdkLoginCheckDto.user_token,
      sign: ""
    }

    let md5 = `app_id=${send_data.app_id}&mem_id=${send_data.mem_id}&user_token=${send_data.user_token}&app_key=${sdkLoginCheckDto.app_key}`

    send_data.sign = new MD5().hex_md5(md5).toLowerCase();


    let ret_data: YltaptapRet = await this.backendDate.sendHttpPost(sdkLoginCheckDto.checkUrl, send_data);

    if (ret_data.status === "1") {
      //Logger.log(`ret_data:`, ret_data);
      return true
    }
    else {
      let cur_msg = YltaptapErrorCode[Number(ret_data.status)];
      Logger.error(`cur_msg:`, cur_msg);
      Logger.error(`ret_data:`, ret_data);
    }
    return false;
  }

}
