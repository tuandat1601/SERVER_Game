import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    return req.headers["x-real-ip"] ? req.headers["x-real-ip"] : req.ip; // individualize IP extraction to meet your own needs
  }
}