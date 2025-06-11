import { ArgumentsHost, Catch, ExceptionFilter, HttpException, WsExceptionFilter } from "@nestjs/common";
import { Logger } from "apps/web-game/src/game-lib/log4js";
import { ReturnCode } from "./return-code";
import { ServerResponseWrapper } from "./server-response-wrapper";
import { Socket } from 'socket.io';
/**
 * 全局WebSocket服务的异常处理，
 * 该Filter在网关中通过 使用 @UseFilters 来进行注册
 * 仅处理WebSocket网关服务
 * WsExceptionFilter
 */
@Catch()
export class WsServiceExceptionFilter implements WsExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any {
        //super.catch(exception, host);
        // 进入该拦截器，说明http调用中存在异常，需要解析异常，并返回统一处理
        let responseWrapper: ServerResponseWrapper;
        // if (exception instanceof BizException) {
        //     // 业务层Exception
        //     responseWrapper = {
        //         code: exception.errorCode.codeString,
        //         errorMessage: exception.errorMessage
        //     }
        // } else {
        //     // 其他错误
        //     responseWrapper = {
        //         code: 'IM9999',
        //         errorMessage: 'server unknown error: ' + exception.message,
        //     };
        // }

        responseWrapper = {
            code: ReturnCode.FAILURE,
            errorMessage: exception.message || exception.errorMessage
        }

        let client: Socket = host.switchToWs().getClient();

        Logger.error({
            address: client.handshake.address,
            data: host.getArgByIndex(1),
            stack: exception.stack,
            msg: exception.message || exception.errorMessage
        })
        // 对异常进行封装以后，需要让框架继续进行调用处理，才能正确的响应给客户端
        // 此时，需要提取到callback这个函数
        // 参考：https://stackoverflow.com/questions/61795299/nestjs-return-ack-in-exception-filter
        const callback = host.getArgByIndex(2);
        if (callback && typeof callback === 'function') {
            callback(responseWrapper);
        }
    }
}