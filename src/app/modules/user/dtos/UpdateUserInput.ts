import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateUserInputZod } from './CreateUserInput';
import { FindUserByIdInputZod } from './FindUserByIdInput';

export const UpdateUserInputZod = z
  .object({})
  .merge(FindUserByIdInputZod)
  .merge(
    CreateUserInputZod.pick({
      name: true,
      email: true,
      matriculaSiape: true,
    }).partial(),
  );

export type IUpdateUserInput = z.infer<typeof UpdateUserInputZod>;

@InputType('UpdateUserInput')
export class UpdateUserInputType implements IUpdateUserInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  name?: string | undefined;

  @Field(() => String, { nullable: true })
  email?: string | undefined;

  @Field(() => String, { nullable: true })
  matriculaSiape?: string | undefined;
}
