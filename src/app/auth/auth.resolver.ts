import { Query, Resolver } from '@nestjs/graphql';
import { ResolveAppContext } from '../app-context/providers/ResolveAppContext';
import { AppContext } from '../app-context/services/AppContext';
import { UserType } from '../modules/user/user.type';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // START: queries

  @Query(() => UserType)
  async getAuthedUser(
    @ResolveAppContext()
    appContext: AppContext,
  ) {
    return this.authService.getAuthedUser(appContext);
  }

  // END: queries

  // START: mutations

  // END: mutations

  // START: fields resolvers

  // END: fields resolvers
}
