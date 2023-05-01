import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ResolveAppContext } from 'src/app/app-context/providers/ResolveAppContext';
import { AppContext } from 'src/app/app-context/services/AppContext';
import { ValidatedArgs } from '../../graphql/ValidatedArgs.decorator';
import { RoleType } from '../role/role.type';
import { UserType } from '../user/user.type';
import {
  AddRoleToUserInputType,
  AddRoleToUserInputZod,
  RemoveRoleFromUserInputType,
  RemoveRoleFromUserInputZod,
} from './dtos';
import { UserHasRoleService } from './user-has-role.service';
import { UserHasRoleType } from './user-has-role.type';

@Resolver(() => UserHasRoleType)
export class UserHasRoleResolver {
  constructor(private userHasRoleService: UserHasRoleService) {}

  // START: queries

  // END: queries

  // START: mutations

  @Mutation(() => UserHasRoleType)
  async addRoleToUser(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', AddRoleToUserInputZod)
    dto: AddRoleToUserInputType,
  ) {
    return this.userHasRoleService.addRoleToUser(appContext, dto);
  }

  @Mutation(() => Boolean)
  async removeRoleFromUser(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', RemoveRoleFromUserInputZod)
    dto: RemoveRoleFromUserInputType,
  ) {
    return this.userHasRoleService.removeRoleFromUser(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('user', () => UserType)
  async user(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: UserHasRoleType,
  ) {
    return this.userHasRoleService.getUserHasRoleUser(appContext, parent.id);
  }

  @ResolveField('role', () => RoleType)
  async role(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: UserHasRoleType,
  ) {
    return this.userHasRoleService.getUserHasRoleRole(appContext, parent.id);
  }

  // END: fields resolvers
}
