import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindUserByIdInputZod } from './FindUserByIdInput';

export const DeleteUserInputZod = FindUserByIdInputZod.pick({ id: true });

export type IDeleteUserInput = z.infer<typeof DeleteUserInputZod>;

@InputType('DeleteUserInput')
export class DeleteUserInputType implements IDeleteUserInput {
  @Field(() => Int)
  id!: number;
}
