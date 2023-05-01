import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from 'src/app/meilisearch/dtos';
import { RoleType } from '../role.type';

@ObjectType('ListRoleResult')
export class ListRoleResultType extends GenericSearchResultType<RoleType | null> {
  @Field(() => [RoleType], { nullable: 'items' })
  items!: (RoleType | null)[];
}
