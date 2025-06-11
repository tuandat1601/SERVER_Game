import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { json } from 'body-parser';
import { map } from 'lodash';
import { lastValueFrom } from 'rxjs';
import { CustomInterceptorIgnore } from './common/interceptors/transform.interceptor';
import { BackendDataService } from './data/backend-data/backend-data.service';
import { BaseResult } from './result/result';
import { WebBackendService } from './web-backend.service';

@Controller()
export class WebBackendController {
  constructor(
    private readonly webBackendService: WebBackendService, private readonly backendDate: BackendDataService,) {
  }

  @Post()
  @CustomInterceptorIgnore()
  async getHello(@Request() req: any, @Body() varData: any) {

    // let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    // let data_info = await prismaBackendDB.orders.findUnique(
    //   {
    //     where: {
    //       id: 1,
    //     },
    //     include: {
    //       games: true,
    //       game_backend_user: true,
    //       servers: true
    //     }
    //   }
    // )

    // console.log(data_info);
    // return "true";
  }
}
