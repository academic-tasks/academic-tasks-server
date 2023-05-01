import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/app/zod/IdZod';
import { z } from 'zod';

export const FindUserHasRoleByIdInputZod = z.object({
  id: IdZod,
});

export type IFindUserHasRoleByIdInput = z.infer<
  typeof FindUserHasRoleByIdInputZod
>;

@InputType('FindUserHasRoleByIdInput')
export class FindUserHasRoleByIdInputType implements IFindUserHasRoleByIdInput {
  @Field(() => Int)
  id!: number;
}
