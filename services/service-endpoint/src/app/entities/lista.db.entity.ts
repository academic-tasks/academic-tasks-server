import { Lista } from '@academic-tasks/schemas';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { ListaMembroDbEntity } from './lista-membro.db.entity';
import { TarefaDbEntity } from './tarefa.db.entity';

@Entity('lista')
export class ListaDbEntity implements Lista {
  @PrimaryColumn({ name: 'id_lista' })
  id!: string;

  @Column({ name: 'title_lista' })
  title!: string;

  //

  @OneToMany(() => ListaMembroDbEntity, (listaMembro) => listaMembro.lista)
  listaMembro!: ListaMembroDbEntity[];

  @OneToMany(() => TarefaDbEntity, (tarefa) => tarefa.lista)
  tarefas!: TarefaDbEntity[];

  //

  listaMembros!: ListaMembroDbEntity[];

  //

  static setupInitialIds(self: ListaDbEntity) {
    if (!self.id) {
      self.id = uuidV4();
    }
  }
}
