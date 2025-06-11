import { Module } from '@nestjs/common';
import { PrismaCrossDBService } from './prisma.cross.service';

@Module({
    providers: [PrismaCrossDBService],
    exports: [PrismaCrossDBService],
})
export class PrismaCrossModule { }
