import { ListaMembro, Usuario } from '@academic-tasks/schemas';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { CargoDbEntity } from './cargo.db.entity';
import { ListaMembroDbEntity } from './lista-membro.db.entity';

@Entity('usuario')
export class UsuarioDbEntity implements Usuario {
  @PrimaryColumn({ name: 'id_usuario' })
  id!: string;

  //

  @Column({ name: 'keycloak_id_usuario', type: 'varchar', nullable: true })
  keycloakId!: string | null;

  //

  @Column({ name: 'username_usuario', type: 'varchar', nullable: true })
  username!: string;

  //

  @OneToMany(() => ListaMembroDbEntity, (listaMembro) => listaMembro.usuario)
  listaMembro!: ListaMembroDbEntity[];

  @ManyToMany(() => CargoDbEntity, { cascade: ['insert', 'remove'] })
  @JoinTable({
    name: 'usuario_has_cargo',
    joinColumn: {
      name: 'usuario',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'cargo',
      referencedColumnName: 'id',
    },
  })
  cargos!: CargoDbEntity[];

  //

  listaMembros!: ListaMembro[];

  static setupInitialIds(self: UsuarioDbEntity) {
    if (!self.id) {
      self.id = uuidV4();
    }
  }
}
