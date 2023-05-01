import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from 'src/app/meilisearch/dtos';
import { UserType } from '../user.type';

@ObjectType('ListUserResult')
export class ListUserResultType extends GenericSearchResultType<UserType | null> {
  @Field(() => [UserType], { nullable: 'items' })
  items!: (UserType | null)[];
}
