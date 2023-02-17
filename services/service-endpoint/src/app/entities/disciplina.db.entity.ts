import { Disciplina } from '@academic-tasks/schemas';
import {
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { DisciplinaProfessorDbEntity } from './disciplina-professor.db.entity';
import { ProfessorDbEntity } from './professor.db.entity';
import { TarefaDbEntity } from './tarefa.db.entity';
import { TurmaDbEntity } from './turma.db.entity';

export class DisciplinaDbEntity implements Disciplina {
  @PrimaryColumn({ name: 'id_disciplina' })
  id!: string;

  @Column({ name: 'name_disciplina' })
  name!: string;

  @Column({ name: 'cod_suap_disciplina' })
  codSuap!: string;

  //

  @ManyToOne(() => TurmaDbEntity, (turma) => turma.disciplinas)
  @JoinColumn({ name: 'id_turma_fk' })
  turma!: TurmaDbEntity;

  @OneToMany(() => TarefaDbEntity, (tarefa) => tarefa.disciplina)
  tarefas!: TarefaDbEntity[];

  //

  disciplinaProfessor!: DisciplinaProfessorDbEntity[];

  //
  professores!: ProfessorDbEntity[];
}
