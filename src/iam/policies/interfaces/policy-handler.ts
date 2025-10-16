import { ActiveUserInterface } from 'src/iam/interfaces/active-user.interface';
import { Policy } from './policy';

export interface PolicyHandler<T extends Policy> {
  handle(policy: T, user: ActiveUserInterface): Promise<void>;
}
