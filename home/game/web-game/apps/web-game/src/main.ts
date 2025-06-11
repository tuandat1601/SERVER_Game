import { NestFactory } from '@nestjs/core';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { ExceptionsFilter } from './common/filters/http-exceptions.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { cTools } from './game-lib/tools';
import { Logger } from '@nestjs/common';



//import * as helmet from 'fastify-helmet';
//import fastifyCsrf from 'fastify-csrf';
declare const module: any;
export const game_data_ver = "ver:20231023-1800|0.0.6";

export let global_app: any = null;

async function bootstrap() {

  global_app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: cTools.getTestModel() ? ['log', 'debug', 'error', 'warn'] : ['error', 'warn'],
    }
  );

  useContainer(global_app.select(AppModule), { fallbackOnErrors: true });

  //app.use(bodyParser.urlencoded({ extended: false }))
  //app.use(bodyParser.json())

  global_app.useGlobalFilters(new ExceptionsFilter());
  global_app.useGlobalPipes(new ValidationPipe());


  global_app.enableCors();
  //app.register(helmet);

  //app.register(fastifyCsrf);
  if (process.env.RUNNING_ENV === "devtest") {
    //api 自动生成文档
    //接口识别
    //@ApiTags()
    //@ApiBearerAuth() 需要认证的API
    //属性识别
    //import { ApiModelProperty } from '@nestjs/swagger'
    // @ApiModelProperty()
    const options = new DocumentBuilder()
      .setTitle('Awesome-nest')
      .setDescription('The Awesome-nest API Documents')
      //.setBasePath('api/v1')
      .addBearerAuth()
      .setVersion('0.0.1')
      .build()

    const document = SwaggerModule.createDocument(global_app, options)
    SwaggerModule.setup('docs', global_app, document)
  }

  //const gameDataService = global_app.get(GameDataService)
  let app_name = "App";
  if (process.env.RUNNING_TYPE == "LN") {
    app_name = "LoginApp";
  }
  else if (process.env.RUNNING_TYPE == "GN") {
    app_name = "GameApp";
  }

  let port = cTools.getAppPort();
  await global_app.listen(port, '0.0.0.0');

  Logger.warn(`[${game_data_ver}][${app_name}] is running on: ${await global_app.getUrl()}`);

  // 监听各种退出事件
  // process.on('SIGHUP', async function () {
  //   //await gameDataService.onDestroy();
  //   global_app.close();
  //   Logger.log('exit SIGHUP:');
  // }
  // );

  // process.on('SIGINT', async function () {
  //   //await gameDataService.onDestroy();
  //   global_app.close();
  //   Logger.log('exit SIGINT:');
  // }
  // );

  // process.on('SIGTERM', async function () {
  //   //await gameDataService.onDestroy();
  //   global_app.close();
  //   Logger.log('exit SIGTERM:');
  // }
  // );

  // process.on('SIGBREAK', async function () {
  //   //await gameDataService.onDestroy();
  //   global_app.close();
  //   Logger.log('exit SIGBREAK:');
  // }
  // );

  // process.on('exit', async function (code) {
  //   //await webLogService.onDestroy();
  //   global_app.close();
  //   Logger.log('exit SIGKILL:'+code);
  //  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => global_app.close());
  }

}
bootstrap();
