import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common'
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { EBActType } from '../../backend-enum';
import { BaseResult } from '../../result/result';

interface Response<T> {
    data: T
}

const IgnoredPropertyName = Symbol('IgnoredPropertyName')

export function CustomInterceptorIgnore() {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.value[IgnoredPropertyName] = true
    };
}

//拦截器
//Interceptor 则负责对成功请求结果进行包装：
@Injectable()
export class TransformBEInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler,): Observable<Response<T>> {

        const isIgnored = context.getHandler()[IgnoredPropertyName]
        if (isIgnored) {
            return next.handle();
        }

        const req = context.getArgByIndex(1).request;
        const now = Date.now();
        return next.handle().pipe(
            map(rawData => {

                let user = req.user || { "name": "backend" };
                const logFormat = `<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    Request original url: ${req.url}
                    Method: ${req.method}
                    IP: ${req.headers["x-real-ip"]}
                    User: ${JSON.stringify(user)}
                    Diftime:${Date.now() - now}ms
                    Response data:\n ${JSON.stringify(rawData)}\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
                //Logger.info(logFormat);
                Logger.access(logFormat);

                return {
                    data: rawData?.data ? rawData.data : {},
                    status: 0,
                    success: rawData.success || false,
                    message: rawData.msg || "",
                }
            }
            )
        )
    }
}