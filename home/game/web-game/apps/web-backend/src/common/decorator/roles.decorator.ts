import { SetMetadata } from '@nestjs/common';
import { EUserRoleType } from '../../backend-enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EUserRoleType[]) => SetMetadata(ROLES_KEY, roles);