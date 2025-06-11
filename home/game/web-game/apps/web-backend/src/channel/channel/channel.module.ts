import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { BackendDataModule } from '../../data/backend-data/backend-data.module';
import { YltaptapModule } from '../yltaptap/yltaptap.module';
import { YoulongModule } from '../youlong/youlong.module';
import { QipaModule } from '../qipa/qipa.module';
import { BrsdkModule } from '../brsdk/brsdk.module';
import { FywechatModule } from '../fywechat/fywechat.module';

@Module({
  imports: [BackendDataModule, YltaptapModule, YoulongModule, QipaModule, BrsdkModule, FywechatModule],
  controllers: [ChannelController],
  providers: [ChannelService]
})
export class ChannelModule { }
