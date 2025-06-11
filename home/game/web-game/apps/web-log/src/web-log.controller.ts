import { Controller, Get } from '@nestjs/common';
import { WebLogService } from './web-log.service';

@Controller()
export class WebLogController {
  constructor(private readonly webLogService: WebLogService) {}
}
