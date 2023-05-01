import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ResolveAppContext } from 'src/app/app-context/providers/ResolveAppContext';
import { AppContext } from 'src/app/app-context/services/AppContext';
import {
  GenericListInputType,
  GenericListInputZod,
} from 'src/app/meilisearch/dtos';
import { ValidatedArgs } from '../../graphql/ValidatedArgs.decorator';
import { RoleType } from '../role/role.type';
import {
  CreateUserInputType,
  CreateUserInputZod,
  DeleteUserInputType,
  DeleteUserInputZod,
  FindUserByIdInputType,
  FindUserByIdInputZod,
  UpdateUserInputType,
  UpdateUserInputZod,
  UpdateUserPasswordInputType,
  UpdateUserPasswordInputZod,
} from './dtos';
import { ListUserResultType } from './dtos/ListUserResult';
import { UserService } from './user.service';
import { UserType } from './user.type';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private userService: UserService) {}

  // START: queries

  @Query(() => UserType)
  async findUserById(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', FindUserByIdInputZod)
    dto: FindUserByIdInputType,
  ) {
    return this.userService.findUserByIdStrict(appContext, dto);
  }

  @Query(() => ListUserResultType)
  async listUser(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.userService.listUser(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => UserType)
  async createUser(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', CreateUserInputZod)
    dto: CreateUserInputType,
  ) {
    return this.userService.createUser(appContext, dto);
  }

  @Mutation(() => UserType)
  async updateUser(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', UpdateUserInputZod)
    dto: UpdateUserInputType,
  ) {
    return this.userService.updateUser(appContext, dto);
  }

  @Mutation(() => Boolean)
  async updateUserPassword(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', UpdateUserPasswordInputZod)
    dto: UpdateUserPasswordInputType,
  ) {
    return this.userService.updateUserPassword(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', DeleteUserInputZod)
    dto: DeleteUserInputType,
  ) {
    return this.userService.deleteUser(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('name', () => String, { nullable: true })
  async name(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent() parent: UserType,
  ) {
    return this.userService.getUserName(appContext, parent.id);
  }

  @ResolveField('email', () => String, { nullable: true })
  async email(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent() parent: UserType,
  ) {
    return this.userService.getUserEmail(appContext, parent.id);
  }

  @ResolveField('keycloakId', () => String, { nullable: true })
  async keycloakId(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent() parent: UserType,
  ) {
    return this.userService.getUserKeycloakId(appContext, parent.id);
  }

  @ResolveField('matriculaSiape', () => String, { nullable: true })
  async matriculaSiape(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent() parent: UserType,
  ) {
    return this.userService.getUserMatriculaSiape(appContext, parent.id);
  }

  @ResolveField('roles', () => [RoleType])
  async roles(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent() parent: UserType,
  ) {
    return this.userService.getUserRoles(appContext, parent.id);
  }

  // END: fields resolvers
}
