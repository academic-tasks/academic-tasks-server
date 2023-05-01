import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from 'src/app/meilisearch/dtos';
import { UserHasRoleType } from '../user-has-role.type';

@ObjectType('ListUserHasRoleResult')
export class ListUserHasRoleResultType extends GenericSearchResultType<UserHasRoleType | null> {
  @Field(() => [UserHasRoleType], { nullable: 'items' })
  items!: (UserHasRoleType | null)[];
}
