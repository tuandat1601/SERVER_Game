import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { GameDataService } from 'apps/web-game/src/game-data/gamedata.service';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { useContainer } from 'class-validator';
import { WebSaveDataModule } from './web-save-data.module';
import { WebSaveDataService } from './web-save-data.service';

declare const module: any;

export const save_data_ver = "ver:0.0.9";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    WebSaveDataModule,
    new FastifyAdapter(),
    {
      logger: ['log', 'debug', 'error', 'warn']
    }
  );

  useContainer(app.select(WebSaveDataModule), { fallbackOnErrors: true });

  //app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  //app.register(helmet);

  //app.register(fastifyCsrf);
  let port = cTools.getAppPort();

  const gameDataService = app.get(GameDataService);
  const webSaveDataService = app.get(WebSaveDataService);

  gameDataService.getGameConfigService().loadAllJson();


  let server_ids = await gameDataService.initServerInfo();
  await webSaveDataService.initDate(server_ids);

  await app.listen(port, '0.0.0.0');

  Logger.log(`[${save_data_ver}][web-save-data] is  running on: ${await app.getUrl()}`);

  // 监听各种退出事件
  process.on('SIGHUP', async function () {
    await webSaveDataService.onDestroy();
    app.close();
    Logger.log('exit SIGHUP:');
  }
  );

  process.on('SIGINT', async function () {
    await webSaveDataService.onDestroy();
    app.close();
    Logger.log('exit SIGINT:');
  }
  );

  process.on('SIGTERM', async function () {
    await webSaveDataService.onDestroy();
    app.close();
    Logger.log('exit SIGTERM:');
  }
  );

  process.on('SIGBREAK', async function () {
    await webSaveDataService.onDestroy();
    app.close();
    Logger.log('exit SIGBREAK:');
  }
  );

  process.on('exit', async function (code) {
    //await webLogService.onDestroy();
    app.close();
    Logger.log('exit SIGKILL:' + code);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}
bootstrap();
