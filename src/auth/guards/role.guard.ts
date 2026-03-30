import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthRequest } from '../interfaces/authRequest.interface';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from 'src/user/types/user.types';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request: AuthRequest = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.some((role) => user?.role === role);
  }
}
