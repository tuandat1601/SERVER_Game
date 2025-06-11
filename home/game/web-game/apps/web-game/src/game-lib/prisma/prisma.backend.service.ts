import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as PrismaClient3 } from '@prisma/client3';
@Injectable()
export class PrismaBackendDBService extends PrismaClient3 implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}
