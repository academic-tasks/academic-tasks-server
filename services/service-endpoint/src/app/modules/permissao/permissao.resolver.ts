import {
  CreatePermissaoInputZod,
  DeletePermissaoInputZod,
  FindPermissaoByIdInputZod,
  UpdatePermissaoInputZod,
} from '@academic-tasks/schemas';
import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { AuthMode } from '../../../infrastructure/auth/consts/AuthMode';
import { BindResourceActionRequest } from '../../../infrastructure/auth/decorators/BindResourceActionRequest.decorator';
import { ResourceAuth } from '../../../infrastructure/auth/decorators/ResourceAuth.decorator';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import { ValidatedArgs } from '../../../infrastructure/graphql/ValidatedArgs.decorator';
import {
  CreatePermissaoInputType,
  DeletePermissaoInputType,
  FindPermissaoByIdInputType,
  UpdatePermissaoInputType,
} from './dtos';
import { PermissoesService } from './permissao.service';
import { PermissaoType } from './permissao.type';

@Resolver(() => PermissaoType)
export class PermissaoResolver {
  constructor(private permissoesService: PermissoesService) {}

  // START: queries

  @ResourceAuth(AuthMode.OPTIONAL)
  @Query(() => PermissaoType)
  async findPermissaoById(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', FindPermissaoByIdInputZod)
    dto: FindPermissaoByIdInputType,
  ) {
    return this.permissoesService.findPermissaoById(resourceActionRequest, dto);
  }

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => PermissaoType)
  async createPermissao(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', CreatePermissaoInputZod)
    dto: CreatePermissaoInputType,
  ) {
    return this.permissoesService.createPermissao(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => PermissaoType)
  async updatePermissao(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', UpdatePermissaoInputZod)
    dto: UpdatePermissaoInputType,
  ) {
    return this.permissoesService.updatePermissao(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => PermissaoType)
  async deletePermissao(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', DeletePermissaoInputZod)
    dto: DeletePermissaoInputType,
  ) {
    return this.permissoesService.deletePermissao(resourceActionRequest, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('description', () => GraphQLJSON)
  async description(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() permissao: PermissaoType,
  ): Promise<PermissaoType['description']> {
    const { id } = permissao;

    return this.permissoesService.getPermissaoDescription(
      resourceActionRequest,
      id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('recipe', () => GraphQLJSON)
  async recipe(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() permissao: PermissaoType,
  ): Promise<PermissaoType['recipe']> {
    const { id } = permissao;
    return this.permissoesService.getPermissaoRecipe(resourceActionRequest, id);
  }

  // END: fields resolvers
}
