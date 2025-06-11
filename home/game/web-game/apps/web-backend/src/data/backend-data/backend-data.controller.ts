import { Controller } from '@nestjs/common';
import { BackendDataService } from './backend-data.service';

@Controller('backend-data')
export class BackendDataController {
  constructor(private readonly backendDataService: BackendDataService) { }
}
