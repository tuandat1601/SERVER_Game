import { Module } from '@nestjs/common';
import { FywechatService } from './fywechat.service';
import { FywechatController } from './fywechat.controller';
import { BackendDataModule } from '../../data/backend-data/backend-data.module';

@Module({
  imports: [BackendDataModule],
  controllers: [FywechatController],
  providers: [FywechatService],
  exports: [FywechatService]
})
export class FywechatModule { }
