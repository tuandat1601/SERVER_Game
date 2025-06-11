import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as PrismaClient1 } from '@prisma/client1';
@Injectable()
export class PrismaGameDBService extends PrismaClient1 implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

}
