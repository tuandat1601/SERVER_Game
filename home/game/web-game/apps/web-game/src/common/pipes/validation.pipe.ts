import {
    PipeTransform,
    ArgumentMetadata,
    BadRequestException,
    Injectable,
  } from '@nestjs/common'
  import { validate } from 'class-validator'
  import { plainToClass } from 'class-transformer'
  import * as _ from 'lodash'
  
  //验证类数据是否合法
  @Injectable()
  export class ValidationPipe implements PipeTransform<any> {
    async transform(value:any, metadata: ArgumentMetadata) {
      const { metatype } = metadata
      if (!metatype || !this.toValidate(metatype)) {
        return value
      }
      const object = plainToClass(metatype, value)
      const errors = await validate(object)
      if (errors.length > 0) {
        const errorMessage = _.values(errors[0].constraints)[0]
        throw new BadRequestException(errorMessage)
      }
      return value
    }
  
    private toValidate(metatype:any): boolean {
      const types = [String, Boolean, Number, Array, Object]
      return !types.find(type => metatype === type)
    }
  }