import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ExceptionsFilter } from 'apps/web-game/src/common/filters/http-exceptions.filter';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { useContainer } from 'class-validator';
import { WebCrossServerModule } from './web-cross-server.module';
import { WebCrossServerService } from './web-cross-server.service';

declare const module: any;

export const web_crossServer_ver = "ver:0.0.1";

async function bootstrap() {

  const app = await NestFactory.create<NestFastifyApplication>(
    WebCrossServerModule,
    new FastifyAdapter(),
    {
      logger: ['log', 'debug', 'error', 'warn']
    }
  );

  useContainer(app.select(WebCrossServerModule), { fallbackOnErrors: true });

  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  let port = cTools.getAppPort();
  //const gameDataService = app.get(GameDataService);
  const webSaveDataService = app.get(WebCrossServerService);
  await webSaveDataService.initCrossServer();

  //gameDataService.getGameConfigService().loadAllJson();

  //app.use('/cross', app.getHttpServer()); // 设置路由前缀为 '/cross' 
  await app.listen(port, '0.0.0.0');

  Logger.log(`[web_crossServer][${web_crossServer_ver}] is running on: ${await app.getUrl()}`);

  // 监听各种退出事件
  process.on('SIGHUP', async function () {

    await webSaveDataService.onDestroyCross();
    app.close();
    Logger.log('exit SIGHUP:');
  }
  );

  process.on('SIGINT', async function () {

    await webSaveDataService.onDestroyCross();
    app.close();
    Logger.log('exit SIGINT:');
  }
  );

  process.on('SIGTERM', async function () {
    await webSaveDataService.onDestroyCross();
    app.close();
    Logger.log('exit SIGTERM:');
  }
  );

  process.on('SIGBREAK', async function () {

    await webSaveDataService.onDestroyCross();
    app.close();
    Logger.log('exit SIGBREAK:');
  }
  );

  process.on('exit', async function (code) {
    await webSaveDataService.onDestroyCross();
    app.close();
    Logger.log('exit SIGKILL:' + code);
  });


  /* process.on('SIGINT', function () {
  //   webLogService.onDestroy();
  //   Logger.debug('Got SIGINT. Press Control-D/Control-C to exit.');
  // });
  */
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}
bootstrap();
