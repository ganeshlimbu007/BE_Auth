import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/user-role.enum';
import { StepCounterPermissionType } from 'src/iam/authorization/step.permissions';
import { StepCounterPermissionEnum } from 'src/step-counter/step-counter.permission';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: Role, default: Role.USER })
  role: Role;

  @Column({ enum: StepCounterPermissionEnum, default: [], type: 'json' })
  permissions: StepCounterPermissionType[];
}
