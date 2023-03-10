import { Tarefa } from '@academic-tasks/schemas';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { DisciplinaDbEntity } from './disciplina.db.entity';
import { ListaDbEntity } from './lista.db.entity';

@Entity('tarefa')
export class TarefaDbEntity implements Tarefa {
  @PrimaryColumn({ name: 'id_tarefa' })
  id!: string;

  @Column({ name: 'title_tarefa' })
  title!: string;

  @Column({ name: 'description_tarefa' })
  description!: string;

  @Column({
    name: 'date_open_tarefa',
    type: 'timestamp with time zone',
    nullable: true,
  })
  dateOpen!: Date | null;

  @Column({
    name: 'date_close_tarefa',
    type: 'timestamp with time zone',
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

  //

  static setupInitialIds(self: TarefaDbEntity) {
    if (!self.id) {
      self.id = uuidV4();
    }
  }
}
