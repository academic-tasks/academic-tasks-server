import { ListaMembro } from '@academic-tasks/schemas';
import { JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
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
}
