import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AppContext } from 'src/app-context/AppContext';
import { ResolveAppContext } from 'src/app-context/ResolveAppContext';
import {
  GenericListInputType,
  GenericListInputZod,
} from 'src/meilisearch/dtos';
import { ValidatedArgs } from '../../../graphql/ValidatedArgs.decorator';
import {
  CreateRoleInputType,
  CreateRoleInputZod,
  DeleteRoleInputType,
  DeleteRoleInputZod,
  FindRoleByIdInputType,
  FindRoleByIdInputZod,
  ListRoleResultType,
  UpdateRoleInputType,
  UpdateRoleInputZod,
} from './dtos';
import { RoleService } from './role.service';
import { RoleType } from './role.type';

@Resolver(() => RoleType)
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  // START: queries

  @Query(() => RoleType)
  async findRoleById(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', FindRoleByIdInputZod)
    dto: FindRoleByIdInputType,
  ) {
    return this.roleService.findRoleByIdStrict(appContext, dto);
  }

  @Query(() => ListRoleResultType)
  async listRole(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.roleService.listRole(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => RoleType)
  async createRole(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', CreateRoleInputZod)
    dto: CreateRoleInputType,
  ) {
    return this.roleService.createRole(appContext, dto);
  }

  @Mutation(() => RoleType)
  async updateRole(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', UpdateRoleInputZod)
    dto: UpdateRoleInputType,
  ) {
    return this.roleService.updateRole(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteRole(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', DeleteRoleInputZod)
    dto: DeleteRoleInputType,
  ) {
    return this.roleService.deleteRole(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('slug', () => String)
  async slug(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent() parent: RoleType,
  ) {
    return this.roleService.getRoleSlug(appContext, parent.id);
  }

  // END: fields resolvers
}
