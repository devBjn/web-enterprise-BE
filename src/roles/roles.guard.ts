import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './constants';
import { Roles } from './entity/roles.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const isMarketingManager = requiredRoles.includes(user.roles.name);

    if (isMarketingManager) return true;

    const isAdmin = requiredRoles.includes(user.roles.name);
    if (isAdmin) return true;

    const isMarketingCoordinator = requiredRoles.includes(user.roles.name);
    if (isMarketingCoordinator) return true;

    return requiredRoles.some((role) => user?.roles?.name === role);
  }
}
