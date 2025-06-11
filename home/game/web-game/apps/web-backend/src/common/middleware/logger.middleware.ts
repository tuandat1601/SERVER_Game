import { Injectable, NestMiddleware } from '@nestjs/common';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import { IncomingMessage } from 'http';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

    readPost(req: IncomingMessage) {
        return new Promise<string>((resolve, reject) => {
            let body = '';
            req.on('data', (data: string) => (body += data));
            req.on('error', (error: unknown) => reject(error));
            req.on('end', () => resolve(body));
        });
    }

    async use(req: any, res: any, next: () => void) {
        // console.log(`Request URL:${req.originalUrl} method:${req.method} Time:${Date.now()}`);
        // next();
        const code = res.statusCode;//响应状态吗


        next()


        if (req.originalUrl.indexOf("/docs/") != -1) {
            return;
        }

        const bodyStr = await this.readPost(req);
        // 组装日志信息
        //  Parmas: ${JSON.stringify(req.params)}
        // Query: ${JSON.stringify(req.query)}
        const logFormat = `>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  Request original url: ${req.originalUrl}
  Method: ${req.method}
  Content-type:${req.headers["content-type"]}
  IP: ${req.headers["x-real-ip"]}
  Status code: ${code}
  Body: ${bodyStr} \n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
`;
        //根据状态码，进行日志类型区分
        if (code >= 500) {
            Logger.error(logFormat);
        } else if (code >= 400) {
            Logger.warn(logFormat);
        } else {
            Logger.access(logFormat);
            //Logger.log(logFormat);
        }
    }
}

