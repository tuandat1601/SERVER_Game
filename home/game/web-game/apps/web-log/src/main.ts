import { NestFactory } from '@nestjs/core';
import { WebLogModule } from './web-log.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { WebLogService } from './web-log.service';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import { cTools } from 'apps/web-game/src/game-lib/tools';

declare const module: any;

export const log_data_ver = "ver:0.0.4";

async function bootstrap() {

  const app = await NestFactory.create<NestFastifyApplication>(
    WebLogModule,
    new FastifyAdapter(),
    {
      logger: ['log', 'debug', 'error', 'warn']
    }
  );

  const webLogService = app.get(WebLogService);
  await webLogService.init();

  let port = cTools.getAppPort();

  await app.listen(port, '0.0.0.0');

  Logger.log(`[${log_data_ver}][web-log] is running on: ${await app.getUrl()}`);

  // 监听各种退出事件
  process.on('SIGHUP', async function () {
    await webLogService.onDestroy();
    app.close();
    Logger.log('exit SIGHUP:');
  }
  );

  process.on('SIGINT', async function () {
    await webLogService.onDestroy();
    app.close();
    Logger.log('exit SIGINT:');
  }
  );

  process.on('SIGTERM', async function () {
    await webLogService.onDestroy();
    app.close();
    Logger.log('exit SIGTERM:');
  }
  );

  process.on('SIGBREAK', async function () {
    await webLogService.onDestroy();
    app.close();
    Logger.log('exit SIGBREAK:');
  }
  );

  process.on('exit', async function (code) {
    //await webLogService.onDestroy();
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
