import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindRoleByIdInputZod } from '../../role/dtos';
import { FindUserByIdInputZod } from '../../user/dtos';

export const RemoveRoleFromUserInputZod = z.object({
  roleId: FindRoleByIdInputZod.shape.id,
  userId: FindUserByIdInputZod.shape.id,
});

export type IRemoveRoleFromUserInput = z.infer<
  typeof RemoveRoleFromUserInputZod
>;

@InputType('RemoveRoleFromUserInput')
export class RemoveRoleFromUserInputType implements IRemoveRoleFromUserInput {
  @Field(() => Int)
  roleId!: number;

  @Field(() => Int)
  userId!: number;
}
