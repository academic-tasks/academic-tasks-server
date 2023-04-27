import { Field, Int, ObjectType } from '@nestjs/graphql';
import { RoleType } from '../role/role.type';
import { UserType } from '../user/user.type';

@ObjectType('UserHasRole')
export class UserHasRoleType {
  @Field(() => Int)
  id!: number;

  @Field(() => UserType)
  user!: UserType;

  @Field(() => RoleType)
  role!: RoleType;
}
