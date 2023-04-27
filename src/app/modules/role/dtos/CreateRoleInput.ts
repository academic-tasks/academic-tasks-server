import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const CreateRoleInputZod = z.object({
  slug: z.string(),
});

export type ICreateRoleInput = z.infer<typeof CreateRoleInputZod>;

@InputType('CreateRoleInput')
export class CreateRoleInputType implements ICreateRoleInput {
  @Field()
  slug!: string;
}
