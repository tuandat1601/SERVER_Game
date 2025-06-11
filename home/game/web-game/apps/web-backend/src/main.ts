import { NestFactory } from '@nestjs/core';
import { WebBackendModule } from './web-backend.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionsBEFilter } from './common/filters/http-exceptions.filter';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { WebBackendService } from './web-backend.service';

declare const module: any;
export const data_ver = "ver:20231024-0927|0.0.7";
async function bootstrap() {

  const app = await NestFactory.create<NestFastifyApplication>(
    WebBackendModule,
    new FastifyAdapter(),
    {
      logger: cTools.getTestModel() ? ['log', 'debug', 'error', 'warn'] : ['log', 'error', 'warn'],
    }
  );

  app.useGlobalFilters(new ExceptionsBEFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  //app.register(helmet);

  //app.register(fastifyCsrf);
  if (cTools.getTestModel()) {
    //api 自动生成文档
    //接口识别
    //@ApiTags()
    //@ApiBearerAuth() 需要认证的API
    //属性识别
    //import { ApiModelProperty } from '@nestjs/swagger'
    // @ApiModelProperty()
    const options = new DocumentBuilder()
      .setTitle('web-backend')
      .setDescription('The backend Documents')
      //.setBasePath('api/v1')
      .addBearerAuth()
      .setVersion('0.0.1')
      .build()

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('docs', app, document)
  }


  const bebBackendService = app.get(WebBackendService);
  await bebBackendService.initGameInfo();

  let port = cTools.getAppPort();
  await app.listen(port, '0.0.0.0');

  Logger.log(`[${data_ver}][web-backend] is running on: ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}
bootstrap();

