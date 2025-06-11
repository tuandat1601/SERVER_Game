import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { YltaptapService } from './yltaptap.service';

@Controller('yltaptap')
export class YltaptapController {
  constructor(private readonly yltaptapService: YltaptapService) { }

}
