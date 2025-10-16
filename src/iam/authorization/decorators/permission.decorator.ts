import { SetMetadata } from '@nestjs/common';
import { StepCounterPermissionType } from 'src/step-counter/step-counter.type';

export const PERMISSIONS_KEY = 'permissions';

export const PERMISSIONS = (...types: StepCounterPermissionType[]) => {
  return SetMetadata(PERMISSIONS_KEY, types);
};
