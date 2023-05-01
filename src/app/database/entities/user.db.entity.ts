import { RoleType } from 'src/app/modules/role/role.type';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserHasRoleDbEntity } from './user-has-role.db.entity';

@Entity('user')
export class UserDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'name', nullable: true, type: 'varchar' })
  name!: string | null;

  @Column({ name: 'email', nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ name: 'keycloak_id', nullable: true, type: 'varchar' })
  keycloakId!: string | null;

  @Column({ name: 'matricula_siape', nullable: true, type: 'varchar' })
  matriculaSiape!: string | null;

  //

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  //

  @OneToMany(() => UserHasRoleDbEntity, (userHasRole) => userHasRole.user)
  userHasRole!: UserHasRoleDbEntity[];

  //

  roles!: RoleType[];
}
