import { Controller, Get } from '@nestjs/common';
import { WebSaveDataService } from './web-save-data.service';

@Controller()
export class WebSaveDataController {
  constructor(private readonly webSaveDataService: WebSaveDataService) {}
}
