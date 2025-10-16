import { Injectable } from '@nestjs/common';
import { Policy } from './interfaces/policy';

import { PolicyHandler } from './interfaces/policy-handler';
import { ActiveUserInterface } from '../interfaces/active-user.interface';
import { PolicyHandlerStorage } from './policy-handler.storage';

export class FrameworkContributorPolicy implements Policy {
  name = 'FrameworkContributor';
}

@Injectable()
export class FrameworkContributorPolicyHandler
  implements PolicyHandler<FrameworkContributorPolicy>
{
  constructor(private readonly policyHandlerStorage: PolicyHandlerStorage) {
    this.policyHandlerStorage.add(FrameworkContributorPolicy, this);
  }
  async handle(
    policy: FrameworkContributorPolicy,
    user: ActiveUserInterface,
  ): Promise<void> {
    console.log('hello user', user);
    const isContributor = user.email.endsWith('@test.com');
    if (!isContributor) {
      throw new Error('User is not contributor');
    }
  }
}
