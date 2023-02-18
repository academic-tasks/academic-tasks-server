import {
  CreateUsuarioInputZod,
  DeleteUsuarioInputZod,
  FindUsuarioByIdInputZod,
  SetUsuarioCargosInputZod,
  UpdateUsuarioInputZod,
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
import { CargoType } from '../cargo/cargo.type';
import { ListaMembroType } from '../lista-membro/lista-membro.type';
import {
  CreateUsuarioInputType,
  DeleteUsuarioInputType,
  FindUsuarioByIdInputType,
  SetUsuarioCargosInputType,
  UpdateUsuarioInputType,
} from './dtos';
import { UsuarioService } from './usuario.service';
import { UsuarioType } from './usuario.type';

@Resolver(() => UsuarioType)
export class UsuarioResolver {
  constructor(private usuarioService: UsuarioService) {}

  // START: queries

  @ResourceAuth(AuthMode.OPTIONAL)
  @Query(() => UsuarioType)
  async findUsuarioById(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', FindUsuarioByIdInputZod)
    dto: FindUsuarioByIdInputType,
  ) {
    return this.usuarioService.findUsuarioById(resourceActionRequest, dto);
  }

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => UsuarioType)
  async createUsuario(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', CreateUsuarioInputZod)
    dto: CreateUsuarioInputType,
  ) {
    return this.usuarioService.createUsuario(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => UsuarioType)
  async updateUsuario(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', UpdateUsuarioInputZod)
    dto: UpdateUsuarioInputType,
  ) {
    return this.usuarioService.updateUsuario(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => UsuarioType)
  async setUsuarioCargos(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', SetUsuarioCargosInputZod)
    dto: SetUsuarioCargosInputType,
  ) {
    return this.usuarioService.setUsuarioCargos(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => UsuarioType)
  async deleteUsuario(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', DeleteUsuarioInputZod)
    dto: DeleteUsuarioInputType,
  ) {
    return this.usuarioService.deleteUsuario(resourceActionRequest, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResourceAuth(AuthMode.STRICT)
  @ResolveField('username', () => String)
  async username(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() usuario: UsuarioType,
  ): Promise<UsuarioType['username']> {
    const { id } = usuario;

    const username = <UsuarioType['username']>(
      await this.usuarioService.getUsuarioUsername(resourceActionRequest, id)
    );

    return username;
  }

  @ResourceAuth(AuthMode.STRICT)
  @ResolveField('cargos', () => [CargoType])
  async cargos(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() usuario: UsuarioType,
  ): Promise<CargoType[]> {
    const cargos = await this.usuarioService.getUsuarioCargos(
      resourceActionRequest,
      usuario.id,
    );

    return cargos as CargoType[];
  }

  @ResourceAuth(AuthMode.STRICT)
  @ResolveField('listaMembros', () => [ListaMembroType])
  async listaMembros(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() usuario: UsuarioType,
  ): Promise<ListaMembroType[]> {
    const listaMembros = await this.usuarioService.getUsuarioListaMembros(
      resourceActionRequest,
      usuario.id,
    );

    return listaMembros as ListaMembroType[];
  }

  @ResourceAuth(AuthMode.STRICT)
  @ResolveField('authorizationRules', () => GraphQLJSON)
  async authorizationRules(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() usuario: UsuarioType,
  ): Promise<UsuarioType['authorizationRules']> {
    const { id } = usuario;

    return this.usuarioService.getUsuarioAuthorizationRules(
      resourceActionRequest,
      id,
    );
  }

  // END: fields resolvers
}
