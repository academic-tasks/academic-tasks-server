import { Provider } from '@nestjs/common';
import { getCursoRepository } from 'src/app/repositories/curso.repository';
import { getDisciplinaProfessorRepository } from 'src/app/repositories/disciplina-professor.repository';
import { getDisciplinaRepository } from 'src/app/repositories/disciplina.repository';
import { getListaMembroRepository } from 'src/app/repositories/lista-membro.repository';
import { getListaRepository } from 'src/app/repositories/lista.repository';
import { getPermissaoRepository } from 'src/app/repositories/permissao.repository';
import { getProfessorRepository } from 'src/app/repositories/professor.repository';
import { getTarefaRepository } from 'src/app/repositories/tarefa.repository';
import { getTurmaRepository } from 'src/app/repositories/turma.repository';
import { getUsuarioHasCargoRepository } from 'src/app/repositories/usuario-has-cargo.repository';
import { getUsuarioRepository } from 'src/app/repositories/usuario.repository';
import { DataSource, Repository } from 'typeorm';
import { getCargoHasPermissaoRepository } from '../../../app/repositories/cargo-has-permissao.repository';
import { getCargoRepository } from '../../../app/repositories/cargo.repository';
import { DATA_SOURCE } from '../constants/DATA_SOURCE';
import {
  REPOSITORY_CARGO,
  REPOSITORY_CARGO_HAS_PERMISSAO,
  REPOSITORY_CURSO,
  REPOSITORY_DISCIPLINA,
  REPOSITORY_DISCIPLINA_PROFESSOR,
  REPOSITORY_LISTA,
  REPOSITORY_LISTA_MEMBRO,
  REPOSITORY_PERMISSAO,
  REPOSITORY_PROFESSOR,
  REPOSITORY_TAREFA,
  REPOSITORY_TURMA,
  REPOSITORY_USUARIO,
  REPOSITORY_USUARIO_HAS_CARGO,
} from '../constants/REPOSITORIES.const';

type IFactory<R extends Repository<any> = Repository<any>> = (
  dataSource: DataSource,
) => R;

const REPOSITORIES: [any, IFactory][] = [
  [REPOSITORY_PERMISSAO, getPermissaoRepository],

  [REPOSITORY_CARGO, getCargoRepository],
  [REPOSITORY_CARGO_HAS_PERMISSAO, getCargoHasPermissaoRepository],

  [REPOSITORY_USUARIO, getUsuarioRepository],
  [REPOSITORY_USUARIO_HAS_CARGO, getUsuarioHasCargoRepository],

  //

  [REPOSITORY_CURSO, getCursoRepository],
  [REPOSITORY_TURMA, getTurmaRepository],
  [REPOSITORY_PROFESSOR, getProfessorRepository],

  [REPOSITORY_DISCIPLINA, getDisciplinaRepository],
  [REPOSITORY_DISCIPLINA_PROFESSOR, getDisciplinaProfessorRepository],

  [REPOSITORY_LISTA, getListaRepository],
  [REPOSITORY_LISTA_MEMBRO, getListaMembroRepository],

  [REPOSITORY_TAREFA, getTarefaRepository],
];

const makeRepositoryProvider = (key: any, factory: IFactory): Provider => ({
  provide: key,
  useFactory: (dataSource: DataSource) => factory(dataSource),
  inject: [DATA_SOURCE],
});

export const repositoriesProviders = REPOSITORIES.map(([key, factory]) =>
  makeRepositoryProvider(key, factory),
);
