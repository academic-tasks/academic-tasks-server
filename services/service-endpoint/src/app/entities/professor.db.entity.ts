import { Professor } from '@academic-tasks/schemas';
import { Column, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { DisciplinaProfessorDbEntity } from './disciplina-professor.db.entity';
import { DisciplinaDbEntity } from './disciplina.db.entity';

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

  disciplinas!: DisciplinaDbEntity[];

  //

  static setupInitialIds(self: ProfessorDbEntity) {
    if (!self.id) {
      self.id = uuidV4();
    }
  }
}
