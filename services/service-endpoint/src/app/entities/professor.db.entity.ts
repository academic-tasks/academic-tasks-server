import { Professor } from '@academic-tasks/schemas';
import { Column, OneToMany, PrimaryColumn } from 'typeorm';
import { DisciplinaProfessorDbEntity } from './disciplina-professor.db.entity';
import { TurmaDbEntity } from './turma.db.entity';

export class ProfessorDbEntity implements Professor {
  @PrimaryColumn({ name: 'id_professor' })
  id!: string;

  @Column({ name: 'name_professor' })
  name!: string;

  @Column({ name: 'cod_suap_professor' })
  codSuap!: string;

  //

  @OneToMany(
    () => DisciplinaProfessorDbEntity,
    (disciplinaProfessor) => disciplinaProfessor.professor,
  )
  disciplinaProfessor!: DisciplinaProfessorDbEntity[];

  //

  turmas!: TurmaDbEntity[];
}
