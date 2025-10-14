import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../../decorators/roles.decorator';

import { REQUEST_USER_KEY } from 'src/iam/constants/iam.constant';
import { ActiveUserInterface } from 'src/iam/interfaces/active-user.interface';
import { Role } from 'src/users/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!contextRoles) {
      return true;
    }
    const activeUser: ActiveUserInterface = await context
      .switchToHttp()
      .getRequest()[REQUEST_USER_KEY];

    return contextRoles.some((role) => role === activeUser.role);
  }
}
