import { StepCounterPermissionType } from 'src/step-counter/step-counter.type';
import { Role } from 'src/users/enums/user-role.enum';

export interface ActiveUserInterface {
  sub: number;
  email: string;
  role: Role;
  permissions: StepCounterPermissionType[];
}
