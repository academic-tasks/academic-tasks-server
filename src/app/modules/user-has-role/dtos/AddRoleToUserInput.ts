import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindRoleByIdInputZod } from '../../role/dtos';
import { FindUserByIdInputZod } from '../../user/dtos';

export const AddRoleToUserInputZod = z.object({
  roleId: FindRoleByIdInputZod.shape.id,
  userId: FindUserByIdInputZod.shape.id,
});

export type IAddRoleToUserInput = z.infer<typeof AddRoleToUserInputZod>;

@InputType('AddRoleToUserInput')
export class AddRoleToUserInputType implements IAddRoleToUserInput {
  @Field(() => Int)
  roleId!: number;

  @Field(() => Int)
  userId!: number;
}
