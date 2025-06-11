import { Module } from '@nestjs/common';
import { PrismaBackendDBService } from './prisma.backend.service';
import { PrismaGameDBService } from './prisma.gamedb.service';
import { PrismaLogDBService } from './prisma.logdb.service';

@Module({
  providers: [PrismaGameDBService, PrismaLogDBService, PrismaBackendDBService],
  exports: [PrismaGameDBService, PrismaLogDBService, PrismaBackendDBService],
})
export class PrismaModule { }
