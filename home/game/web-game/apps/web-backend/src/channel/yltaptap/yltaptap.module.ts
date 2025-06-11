import { Module } from '@nestjs/common';
import { YltaptapService } from './yltaptap.service';
import { YltaptapController } from './yltaptap.controller';
import { BackendDataModule } from '../../data/backend-data/backend-data.module';

/**游龙TapTap渠道 */
@Module({
  imports: [BackendDataModule],
  controllers: [YltaptapController],
  providers: [YltaptapService],
  exports: [YltaptapService],
})
export class YltaptapModule { }
