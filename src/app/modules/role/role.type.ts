import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Role')
export class RoleType {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  slug!: string;
}
