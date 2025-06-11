import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard } from "@nestjs/throttler";
import { Socket, Server } from 'socket.io';

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
    async handleRequest(
        context: ExecutionContext,
        limit: number,
        ttl: number,
    ): Promise<boolean> {

        const client: Socket = context.switchToWs().getClient();
        //const ip = client.handshake.address;
        const id = client.id;
        const key = this.generateKey(context, id);
        const { totalHits } = await this.storageService.increment(key, ttl);

        if (totalHits > limit) {
            throw new ThrottlerException();
        }

        return true;
    }
}