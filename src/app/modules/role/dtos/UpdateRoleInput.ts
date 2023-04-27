import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateRoleInputZod } from './CreateRoleInput';
import { FindRoleByIdInputZod } from './FindRoleByIdInput';

export const UpdateRoleInputZod = z
  .object({})
  .merge(FindRoleByIdInputZod)
  .merge(
    CreateRoleInputZod.pick({
      slug: true,
    }).partial(),
  );

export type IUpdateRoleInput = z.infer<typeof UpdateRoleInputZod>;

@InputType('UpdateRoleInput')
export class UpdateRoleInputType implements IUpdateRoleInput {
  @Field(() => Int)
  id!: number;

  @Field({ nullable: true })
  slug?: string;
}
