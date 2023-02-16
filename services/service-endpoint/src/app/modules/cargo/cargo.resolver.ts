import {
  AddPermissaoToCargoInputZod,
  CreateCargoInputZod,
  DeleteCargoInputZod,
  FindCargoByIdInputZod,
  RemovePermissaoFromCargoInputZod,
  UpdateCargoInputZod,
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
import { CargoService } from './cargo.service';
import { CargoType } from './cargo.type';
import {
  CreateCargoInputType,
  DeleteCargoInputType,
  FindCargoByIdInputType,
  UpdateCargoInputType,
} from './dtos';
import { AddPermissaoToCargoInputType } from './dtos/AddPermissaoToCargo.input.type';
import { RemovePermissaoFromCargoInputType } from './dtos/RemovePermissaoFromCargo.input.type';

@Resolver(() => CargoType)
export class CargoResolver {
  constructor(private cargoService: CargoService) {}

  // START: queries

  @ResourceAuth(AuthMode.OPTIONAL)
  @Query(() => CargoType)
  async findCargoById(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', FindCargoByIdInputZod)
    dto: FindCargoByIdInputType,
  ) {
    return this.cargoService.findCargoById(resourceActionRequest, dto);
  }

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => CargoType)
  async createCargo(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', CreateCargoInputZod)
    dto: CreateCargoInputType,
  ) {
    return this.cargoService.createCargo(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => CargoType)
  async updateCargo(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', UpdateCargoInputZod)
    dto: UpdateCargoInputType,
  ) {
    return this.cargoService.updateCargo(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => CargoType)
  async deleteCargo(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', DeleteCargoInputZod)
    dto: DeleteCargoInputType,
  ) {
    return this.cargoService.deleteCargo(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => Boolean)
  async addPermissaoToCargo(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', AddPermissaoToCargoInputZod)
    dto: AddPermissaoToCargoInputType,
  ) {
    return this.cargoService.addPermissaoToCargo(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => Boolean)
  async removePermissaoFromCargo(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', RemovePermissaoFromCargoInputZod)
    dto: RemovePermissaoFromCargoInputType,
  ) {
    return this.cargoService.removePermissaoFromCargo(
      resourceActionRequest,
      dto,
    );
  }

  // END: mutations

  // START: fields resolvers

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('name', () => GraphQLJSON)
  async name(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() permissao: CargoType,
  ): Promise<CargoType['name']> {
    const { id } = permissao;
    return this.cargoService.getCargoName(resourceActionRequest, id);
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('permissoes', () => GraphQLJSON)
  async permissoes(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() permissao: CargoType,
  ): Promise<CargoType['permissoes']> {
    const { id } = permissao;

    return this.cargoService.getCargoPermissoes(resourceActionRequest, id);
  }

  // END: fields resolvers
}
