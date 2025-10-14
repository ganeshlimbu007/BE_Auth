import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/enums/user-role.enum';

export const ROLES_KEY = 'roles';

export const ROLES = (...types: Role[]) => SetMetadata(ROLES_KEY, types);
