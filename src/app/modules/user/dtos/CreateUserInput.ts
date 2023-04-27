import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const CreateUserInputZod = z.object({
  name: z.string().max(255).optional(),

  email: z.string().email(),

  matriculaSiape: z.string().optional(),
});

export type ICreateUserInput = z.infer<typeof CreateUserInputZod>;

@InputType('CreateUserInput')
export class CreateUserInputType implements ICreateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  matriculaSiape?: string;
}
