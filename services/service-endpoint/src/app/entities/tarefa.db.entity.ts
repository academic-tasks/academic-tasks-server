import { Tarefa } from '@academic-tasks/schemas';
import { Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DisciplinaDbEntity } from './disciplina.db.entity';
import { ListaDbEntity } from './lista.db.entity';

export class TarefaDbEntity implements Tarefa {
  @PrimaryColumn({ name: 'id_tarefa' })
  id!: string;

  @Column({ name: 'title_tarefa' })
  title!: string;

  @Column({ name: 'description_tarefa' })
  description!: string;

  @Column({
    name: 'date_open_tarefa',
    type: 'timestamp with local time zone',
    nullable: true,
  })
  dateOpen!: Date | null;

  @Column({
    name: 'date_close_tarefa',
    type: 'timestamp with local time zone',
    nullable: true,
  })
  dateClose!: Date | null;

  @Column({ name: 'submission_format_tarefa' })
  submissionFormat!: string;

  //

  @ManyToOne(() => ListaDbEntity, (lista) => lista.tarefas)
  @JoinColumn({ name: 'id_lista_fk' })
  lista!: ListaDbEntity;

  @ManyToOne(() => DisciplinaDbEntity, (disciplina) => disciplina.tarefas)
  @JoinColumn({ name: 'id_disciplina_fk' })
  disciplina!: DisciplinaDbEntity;
}
