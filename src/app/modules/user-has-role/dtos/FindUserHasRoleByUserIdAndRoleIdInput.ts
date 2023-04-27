import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindRoleByIdInputZod } from '../../role/dtos';
import { FindUserByIdInputZod } from '../../user/dtos';

export const FindUserHasRoleByUserIdAndRoleIdInputZod = z.object({
  roleId: FindRoleByIdInputZod.shape.id,
  userId: FindUserByIdInputZod.shape.id,
});

export type IFindUserHasRoleByUserIdAndRoleIdInput = z.infer<
  typeof FindUserHasRoleByUserIdAndRoleIdInputZod
>;

@InputType('FindUserHasRoleByUserIdAndRoleIdInput')
export class FindUserHasRoleByUserIdAndRoleIdInputType
  implements IFindUserHasRoleByUserIdAndRoleIdInput
{
  @Field(() => Int)
  roleId!: number;

  @Field(() => Int)
  userId!: number;
}
