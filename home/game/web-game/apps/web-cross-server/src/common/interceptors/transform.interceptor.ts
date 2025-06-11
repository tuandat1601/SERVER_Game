import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Logger } from 'apps/web-game/src/game-lib/log4js';

interface Response<T> {
    data: T
}

//拦截器
//Interceptor 则负责对成功请求结果进行包装：
@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        const req = context.getArgByIndex(1).request;
        const now = Date.now();
        let is_show = process.env.LOGGER_HTTPRES === "TRUE";
        return next.handle().pipe(
            map(rawData => {

                if (is_show) {
                    const logFormat = `<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            Request original url: ${req.url}
            Method: ${req.method}
            IP: ${req.headers["x-real-ip"]}
            User: ${JSON.stringify(req.user)}
            Diftime:${Date.now() - now}ms
            Response data:\n ${JSON.stringify(rawData)}\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
                    //Logger.info(logFormat);
                    Logger.access(logFormat);
                }

                return {
                    data: rawData,
                    status: 0,
                    message: '请求成功',
                }
            }
            )
        )
    }
}