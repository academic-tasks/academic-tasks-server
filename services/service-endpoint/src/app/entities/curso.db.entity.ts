import { Curso } from '@academic-tasks/schemas';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
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

  //

  static setupInitialIds(self: CursoDbEntity) {
    if (!self.id) {
      self.id = uuidV4();
    }
  }
}
