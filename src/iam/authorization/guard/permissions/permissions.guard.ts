import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { StepCounterPermissionType } from 'src/step-counter/step-counter.type';
import { PERMISSIONS_KEY } from '../../decorators/permission.decorator';
import { REQUEST_USER_KEY } from 'src/iam/constants/iam.constant';
import { ActiveUserInterface } from 'src/iam/interfaces/active-user.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextPermissions = this.reflector.getAllAndOverride<
      StepCounterPermissionType[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    console.log('hello permissions', contextPermissions);
    if (!contextPermissions) {
      return true;
    }
    const activeUser: ActiveUserInterface = await context
      .switchToHttp()
      .getRequest()[REQUEST_USER_KEY];

    return contextPermissions.every((permission) =>
      activeUser.permissions.includes(permission),
    );
  }
}
