import { Curso } from '@academic-tasks/schemas';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TurmaDbEntity } from './turma.db.entity';

@Entity('curso')
export class CursoDbEntity implements Curso {
  @PrimaryColumn({ name: 'id_curso' })
  id!: string;

  @Column({ name: 'name_curso' })
  name!: string;

  //

  @OneToMany(() => TurmaDbEntity, (turma) => turma.curso)
  turmas!: TurmaDbEntity[];
}
