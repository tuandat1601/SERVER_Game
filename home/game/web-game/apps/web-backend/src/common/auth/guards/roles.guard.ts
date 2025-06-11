import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EUserRoleType } from 'apps/web-backend/src/backend-enum';
import { BackendDataService } from 'apps/web-backend/src/data/backend-data/backend-data.service';
import { ROLES_KEY } from '../../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector, private readonly backendDate: BackendDataService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<EUserRoleType[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) { return true; }

        const { user } = context.switchToHttp().getRequest();
        let userEntity = await this.backendDate.getUserData(user);

        if (!userEntity || !userEntity.roles) { return false; }

        return requiredRoles.some((role) => userEntity.roles?.includes(role));
    }
}