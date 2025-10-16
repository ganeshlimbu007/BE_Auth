import { SetMetadata } from '@nestjs/common';
import { Policy } from 'src/iam/policies/interfaces/policy';

export const POLICY_KEY = 'policies';

export const Policies = (...types: Policy[]) => {
  return SetMetadata(POLICY_KEY, types);
};
