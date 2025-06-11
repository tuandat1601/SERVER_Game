import { Module } from '@nestjs/common';
import { YouLongService } from './youlong.service';
import { YoulongController } from './youlong.controller';
import { BackendDataModule } from '../../data/backend-data/backend-data.module';

@Module({
  imports: [BackendDataModule],
  controllers: [YoulongController],
  providers: [YouLongService],
  exports: [YouLongService]
})
export class YoulongModule { }
