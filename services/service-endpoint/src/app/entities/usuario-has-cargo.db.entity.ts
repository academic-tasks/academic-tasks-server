import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CargoDbEntity } from './cargo.db.entity';
import { UsuarioDbEntity } from './usuario.db.entity';

@Entity('usuario_has_cargo')
export class UsuarioHasCargoDbEntity {
  @PrimaryColumn()
  id!: number;

  @ManyToOne(() => UsuarioDbEntity)
  @JoinColumn({ name: 'id_usuario_fk' })
  usuario!: UsuarioDbEntity;

  @ManyToOne(() => CargoDbEntity)
  @JoinColumn({ name: 'id_cargo_fk' })
  cargo!: CargoDbEntity;
}
