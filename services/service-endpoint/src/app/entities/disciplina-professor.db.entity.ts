import { DisciplinaProfessor } from '@academic-tasks/schemas';
import { JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DisciplinaDbEntity } from './disciplina.db.entity';
import { ProfessorDbEntity } from './professor.db.entity';

export class DisciplinaProfessorDbEntity implements DisciplinaProfessor {
  @PrimaryColumn({ name: 'id_disciplina_professor' })
  id!: string;

  @ManyToOne(
    () => DisciplinaDbEntity,
    (disciplina) => disciplina.disciplinaProfessor,
  )
  @JoinColumn({ name: 'id_disciplina_fk' })
  disciplina!: DisciplinaDbEntity;

  @ManyToOne(
    () => ProfessorDbEntity,
    (professor) => professor.disciplinaProfessor,
  )
  @JoinColumn({ name: 'id_professor_fk' })
  professor!: ProfessorDbEntity;
}
