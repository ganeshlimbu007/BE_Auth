import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Policy } from 'src/iam/policies/interfaces/policy';
import { POLICY_KEY } from '../../decorators/policy.decorator';
import { ActiveUserInterface } from 'src/iam/interfaces/active-user.interface';
import { REQUEST_USER_KEY } from 'src/iam/constants/iam.constant';
import { PolicyHandlerStorage } from 'src/iam/policies/policy-handler.storage';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly policyHandlerStorage: PolicyHandlerStorage,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policies = this.reflector.getAllAndOverride<Policy[]>(POLICY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (policies) {
      const user: ActiveUserInterface = await context
        .switchToHttp()
        .getRequest()[REQUEST_USER_KEY];

      await Promise.all(
        policies.map((policy) => {
          const policyHandler = this.policyHandlerStorage.get(
            policy.constructor as Type,
          );
          return policyHandler.handle(policy, user);
        }),
      ).catch((err) => {
        throw new ForbiddenException(err.message);
      });
    }
    return true;
  }
}
