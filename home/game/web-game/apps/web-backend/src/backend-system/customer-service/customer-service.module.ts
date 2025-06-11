import { Module } from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { CustomerServiceController } from './customer-service.controller';
import { BackendDataModule } from '../../data/backend-data/backend-data.module';

@Module({
  imports: [BackendDataModule],
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService]
})
export class CustomerServiceModule { }
