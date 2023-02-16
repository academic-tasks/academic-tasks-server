import { Provider } from '@nestjs/common';
import { getPermissaoRepository } from 'src/app/repositories/permissao.repository';
import { getUsuarioHasCargoRepository } from 'src/app/repositories/usuario-has-cargo.repository';
import { getUsuarioRepository } from 'src/app/repositories/usuario.repository';
import { DataSource, Repository } from 'typeorm';
import { getCargoHasPermissaoRepository } from '../../../app/repositories/cargo-has-permissao.repository';
import { getCargoRepository } from '../../../app/repositories/cargo.repository';
import { DATA_SOURCE } from '../constants/DATA_SOURCE';
import {
  REPOSITORY_CARGO,
  REPOSITORY_CARGO_HAS_PERMISSAO,
  REPOSITORY_PERMISSAO,
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
];

const makeRepositoryProvider = (key: any, factory: IFactory): Provider => ({
  provide: key,
  useFactory: (dataSource: DataSource) => factory(dataSource),
  inject: [DATA_SOURCE],
});

export const repositoriesProviders = REPOSITORIES.map(([key, factory]) =>
  makeRepositoryProvider(key, factory),
);
