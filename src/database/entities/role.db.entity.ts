import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserHasRoleDbEntity } from './user-has-role.db.entity';

@Entity('role')
export class RoleDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'slug', type: 'varchar' })
  slug!: string;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(() => UserHasRoleDbEntity, (userHasRole) => userHasRole.role)
  userHasRole!: UserHasRoleDbEntity[];
}
