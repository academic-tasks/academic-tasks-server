import { Field, Int, ObjectType } from '@nestjs/graphql';
import { RoleType } from '../role/role.type';

@ObjectType('User')
export class UserType {
  @Field(() => Int)
  id!: number;

  //

  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => String, { nullable: true })
  keycloakId!: string | null;

  @Field(() => String, { nullable: true })
  matriculaSiape!: string | null;

  //

  @Field(() => [RoleType])
  roles!: RoleType[];
}
