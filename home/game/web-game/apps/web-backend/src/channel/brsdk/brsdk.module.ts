import { Module } from '@nestjs/common';
import { BrsdkService } from './brsdk.service';
import { BrsdkController } from './brsdk.controller';
import { BackendDataModule } from '../../data/backend-data/backend-data.module';

@Module({
  imports: [BackendDataModule],
  controllers: [BrsdkController],
  providers: [BrsdkService],
  exports: [BrsdkService]
})
export class BrsdkModule { }
