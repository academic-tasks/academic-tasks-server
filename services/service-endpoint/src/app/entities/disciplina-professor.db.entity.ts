import { DisciplinaProfessor } from '@academic-tasks/schemas';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { DisciplinaDbEntity } from './disciplina.db.entity';
import { ProfessorDbEntity } from './professor.db.entity';

@Entity('disciplina_professor')
export class DisciplinaProfessorDbEntity implements DisciplinaProfessor {
  @PrimaryColumn({ name: 'id_disciplina_professor' })
  id!: string;

  //

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

  //

  static setupInitialIds(self: DisciplinaProfessorDbEntity) {
    if (!self.id) {
      self.id = uuidV4();
    }
  }
}
