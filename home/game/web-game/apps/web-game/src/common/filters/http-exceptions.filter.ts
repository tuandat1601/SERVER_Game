import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import { Logger } from '../../game-lib/log4js';

const NO_ERROR_LOLG = {
  [HttpStatus.UNAUTHORIZED]: 1,
  [HttpStatus.TOO_MANY_REQUESTS]: 1,
  [HttpStatus.FORBIDDEN]: 1,
  [HttpStatus.NOT_FOUND]: 1,
  [HttpStatus.BAD_REQUEST]: 1,

}

//过滤器
//错误列外统一处理
@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    let message = exception.message
    let isDeepestMessage = false
    while (!isDeepestMessage) {
      isDeepestMessage = !message.message
      message = isDeepestMessage ? message : message.message
    }

    if (message) {
      if (process.env.RUNNING_ENV !== 'prod') {
        //console.log('error:', exception.message)
      }
      else {
        //写错误日志
        message = '请求失败'
      }

    }
    const errorResponse = {
      message: message || '请求失败',
      code: 1,
    }

    const status = exception instanceof HttpException ?
      exception.getStatus() :
      HttpStatus.INTERNAL_SERVER_ERROR
    if (!NO_ERROR_LOLG[status]) {
      const logFormat = `<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                  Request original url: ${request.url}
                  Method: ${request.method}
                  IP: ${request.headers["x-real-ip"]}
                  Status code: ${status}
                  error: ${exception.message} 
                  stack:${exception.stack || ""}\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                  `;
      Logger.error(logFormat);
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorResponse.message = `SERVER ERROR`;
    }
    else if (status === HttpStatus.TOO_MANY_REQUESTS) {
      errorResponse.message = `操作太过频繁！`;
    }

    response.status(status)
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send(errorResponse)
  }
}