import { ListaMembro } from '@academic-tasks/schemas';
import { JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { ListaDbEntity } from './lista.db.entity';
import { UsuarioDbEntity } from './usuario.db.entity';

export class ListaMembroDbEntity implements ListaMembro {
  @PrimaryColumn({ name: 'id_lista_membro' })
  id!: string;

  @ManyToOne(() => ListaDbEntity, (lista) => lista.listaMembro)
  @JoinColumn({ name: 'id_lista_fk' })
  lista!: ListaDbEntity;

  @ManyToOne(() => UsuarioDbEntity, (usuario) => usuario.listaMembro)
  @JoinColumn({ name: 'id_usuario_fk' })
  usuario!: UsuarioDbEntity;

  //

  static setupInitialIds(self: ListaMembroDbEntity) {
    if (!self.id) {
      self.id = uuidV4();
    }
  }
}
