import { Turma } from '@academic-tasks/schemas';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { CursoDbEntity } from './curso.db.entity';
import { DisciplinaDbEntity } from './disciplina.db.entity';

@Entity('turma')
export class TurmaDbEntity implements Turma {
  @PrimaryColumn({ name: 'id_turma' })
  id!: string;

  @Column({ name: 'name_turma' })
  name!: string;

  @Column({ name: 'year_turma' })
  year!: number;

  @Column({ name: 'serie_turma' })
  serie!: string;

  @Column({ name: 'turno_turma' })
  turno!: string;

  //

  //

  @ManyToOne(() => CursoDbEntity, (curso) => curso.turmas)
  @JoinColumn({ name: 'id_curso_fk' })
  curso!: CursoDbEntity;

  @OneToMany(() => DisciplinaDbEntity, (disciplina) => disciplina.turma)
  disciplinas!: DisciplinaDbEntity[];

  //

  static setupInitialIds(self: TurmaDbEntity) {
    if (!self.id) {
      self.id = uuidV4();
    }
  }
}
