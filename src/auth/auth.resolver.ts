import { Query, Resolver } from '@nestjs/graphql';
import { AppContext } from '../app-context/AppContext';
import { ResolveAppContext } from '../app-context/ResolveAppContext';
import { UserType } from '../app/modules/user/user.type';
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
