import { Controller, Get } from '@nestjs/common';
import { WebChatService } from './web-chat.service';

@Controller()
export class WebChatController {
  constructor(private readonly webChatService: WebChatService) { }

  // @Get()
  // getHello(): string {
  //   return this.webChatService.getHello();
  // }
}
