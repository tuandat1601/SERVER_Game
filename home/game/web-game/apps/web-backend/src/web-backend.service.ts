import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BackendDataService } from './data/backend-data/backend-data.service';
import { BEGameInfoEntity } from './entity/game.entity';

@Injectable()
export class WebBackendService {
  // getHello(): string {
  //   return 'Hello World!';
  // }
  constructor(
    private readonly backendDate: BackendDataService,
  ) {

  }

  async initGameInfo() {
    await this.backendDate.initBackendData();
  }

  @Cron(CronExpression.EVERY_SECOND)
  async handleCronAutoOpenServer() {

    await this.backendDate.checkAutoOpenServer();

  }
}
