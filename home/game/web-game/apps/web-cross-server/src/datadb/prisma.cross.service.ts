import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as PrismaClient4 } from '@prisma/client4';
@Injectable()
export class PrismaCrossDBService extends PrismaClient4 implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}
