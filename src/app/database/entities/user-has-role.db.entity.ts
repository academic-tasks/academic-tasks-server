import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { RoleDbEntity } from './role.db.entity';
import { UserDbEntity } from './user.db.entity';

@Entity('user_has_role')
export class UserHasRoleDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => UserDbEntity)
  @JoinColumn({ name: 'id_user' })
  user!: UserDbEntity;

  @ManyToOne(() => RoleDbEntity)
  @JoinColumn({ name: 'id_role' })
  role!: RoleDbEntity;

}
