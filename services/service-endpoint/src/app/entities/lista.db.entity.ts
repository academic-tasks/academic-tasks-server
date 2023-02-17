import { Lista } from '@academic-tasks/schemas';
import { Column, OneToMany, PrimaryColumn } from 'typeorm';
import { ListaMembroDbEntity } from './lista-membro.db.entity';
import { TarefaDbEntity } from './tarefa.db.entity';

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
}
