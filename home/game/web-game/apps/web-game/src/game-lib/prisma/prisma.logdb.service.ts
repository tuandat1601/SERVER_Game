import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as PrismaClient2 } from '@prisma/client2';
@Injectable()
export class PrismaLogDBService extends PrismaClient2 implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
