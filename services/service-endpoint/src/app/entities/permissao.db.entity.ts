import { Permissao } from '@academic-tasks/schemas';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { CargoHasPermissaoDbEntity } from './cargo-has-permissao.db.entity';

@Entity('permissao')
export class PermissaoDbEntity implements Permissao {
  @PrimaryColumn({ name: 'id_permissao' })
  id!: string;

  //

  @Column({ name: 'description_permissao' })
  description!: string;

  @Column({ name: 'recipe_permissao' })
  recipe!: string;

  //

  @OneToMany(
    () => CargoHasPermissaoDbEntity,
    (cargoHasPermissao) => cargoHasPermissao.permissao,
  )
  cargoHasPermissoes!: CargoHasPermissaoDbEntity[];

  //

  static setupInitialIds(self: PermissaoDbEntity) {
    if (!self.id) {
      self.id = uuidV4();
    }
  }
}
