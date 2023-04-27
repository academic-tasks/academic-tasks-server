import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindRoleByIdInputZod } from './FindRoleByIdInput';

export const DeleteRoleInputZod = FindRoleByIdInputZod.pick({
  id: true,
});

export type IDeleteRoleInput = z.infer<typeof DeleteRoleInputZod>;

@InputType('DeleteRoleInput')
export class DeleteRoleInputType implements IDeleteRoleInput {
  @Field(() => Int)
  id!: number;
}
