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
    // const { user } = context.switchToHttp().getRequest();
    // console.log(user, 'user');

    const request = context.switchToHttp().getRequest();

    console.log(requiredRoles, 'required Roles');
    console.log(request);
    // const isMarketingManager = account?.roles.includes(Roles.name);
    // if (isMarketingManager) return true;

    // return requiredRoles.some((role) => account?.roles?.includes(role));
    return;
  }
}
