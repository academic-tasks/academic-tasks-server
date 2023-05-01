import { RoleDbEntity } from 'src/app/database/entities/role.db.entity';
import { getRoleRepository } from 'src/app/database/repositories/role.repository';
import { getUserRepository } from 'src/app/database/repositories/user.repository';
import { UserDbEntity } from '../../database/entities/user.db.entity';
import { INDEX_ROLE, INDEX_USER } from '../constants/meilisearch-tokens';
import { IMeiliSearchIndexDefinition } from '../interfaces/MeiliSearchIndexDefinition';

export const MeilisearchIndexDefinitions: IMeiliSearchIndexDefinition[] = [
  {
    index: INDEX_ROLE,

    primaryKey: 'id',

    searchable: ['id', 'slug'],

    filterable: ['id'],
    sortable: ['slug'],

    getSearchableDataView: () => ['id', 'slug'],

    getTypeormEntity: () => RoleDbEntity,
    getTypeormRepositoryFactory: () => getRoleRepository,
  },

  {
    index: INDEX_USER,

    primaryKey: 'id',

    searchable: ['id', 'matriculaSiape'],
    filterable: ['id'],
    sortable: ['matriculaSiape'],

    getSearchableDataView: () => ['id', 'matriculaSiape'],

    getTypeormEntity: () => UserDbEntity,
    getTypeormRepositoryFactory: () => getUserRepository,
  },
];
