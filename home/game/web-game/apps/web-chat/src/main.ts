import { NestFactory } from '@nestjs/core';
import { WebChatModule } from './web-chat.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import { cTools } from 'apps/web-game/src/game-lib/tools';

declare const module: any;

export const web_chat_ver = "ver:0.0.1";

async function bootstrap() {

  const app = await NestFactory.create<NestFastifyApplication>(
    WebChatModule,
    new FastifyAdapter(),
    {
      logger: ['log', 'debug', 'error', 'warn']
    }
  );


  let port = cTools.getAppPort();

  await app.listen(port, '0.0.0.0');

  Logger.log(`[${web_chat_ver}][web-chat] is running on: ${await app.getUrl()}`);

  // 监听各种退出事件
  process.on('SIGHUP', async function () {

    app.close();
    Logger.log('exit SIGHUP:');
  }
  );

  process.on('SIGINT', async function () {

    app.close();
    Logger.log('exit SIGINT:');
  }
  );

  process.on('SIGTERM', async function () {

    app.close();
    Logger.log('exit SIGTERM:');
  }
  );

  process.on('SIGBREAK', async function () {

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
