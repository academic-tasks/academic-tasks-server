import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindUserByIdInputZod = z.object({
  id: IdZod,
});

export type IFindUserByIdInput = z.infer<typeof FindUserByIdInputZod>;

@InputType('FindUserByIdInput')
export class FindUserByIdInputType implements IFindUserByIdInput {
  @Field(() => Int)
  id!: number;
}
