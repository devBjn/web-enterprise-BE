import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from './constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { account } = context.switchToHttp().getRequest();

    const isMarketingManager = account?.roles.includes(Role.MARKETING_MANAGER);
    if (isMarketingManager) return true;

    return requiredRoles.some((role) => account?.roles?.includes(role));
  }
}
