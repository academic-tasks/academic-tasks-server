import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindRoleByIdInputZod = z.object({
  id: IdZod,
});

export type IFindRoleByIdInput = z.infer<typeof FindRoleByIdInputZod>;

@InputType('FindRoleByIdInput')
export class FindRoleByIdInputType implements IFindRoleByIdInput {
  @Field(() => Int)
  id!: number;
}
