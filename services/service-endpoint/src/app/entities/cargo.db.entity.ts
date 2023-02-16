import { Cargo } from '@academic-tasks/schemas';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { CargoHasPermissaoDbEntity } from './cargo-has-permissao.db.entity';
import { UsuarioHasCargoDbEntity } from './usuario-has-cargo.db.entity';

@Entity('cargo')
export class CargoDbEntity implements Cargo {
  @PrimaryColumn({ name: 'id_cargo' })
  id!: string;

  //

  @Column({ name: 'name_cargo' })
  name!: string;

  //

  @OneToMany(
    () => UsuarioHasCargoDbEntity,
    (usuarioHasCargo) => usuarioHasCargo.cargo,
  )
  usuarioHasCargos!: UsuarioHasCargoDbEntity[];

  @OneToMany(
    () => CargoHasPermissaoDbEntity,
    (cargoHasPermissao) => cargoHasPermissao.cargo,
  )
  cargoHasPermissoes!: CargoHasPermissaoDbEntity[];

  //

  static setupInitialIds(self: CargoDbEntity) {
    if (!self.id) {
      self.id = uuidV4();
    }
  }
}
