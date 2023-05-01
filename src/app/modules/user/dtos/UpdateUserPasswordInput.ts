import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindUserByIdInputZod } from './FindUserByIdInput';

export const UpdateUserPasswordInputZod = z
  .object({})
  .merge(FindUserByIdInputZod)
  .merge(
    z.object({
      currentPassword: z.string(),

      newPassword: z.string(),
      confirmNewPassword: z.string(),
    }),
  )
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });
export type IUpdateUserPasswordInput = z.infer<
  typeof UpdateUserPasswordInputZod
>;

@InputType('UpdateUserPasswordInput')
export class UpdateUserPasswordInputType implements IUpdateUserPasswordInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: false })
  currentPassword!: string;

  @Field(() => String, { nullable: false })
  newPassword!: string;

  @Field(() => String, { nullable: false })
  confirmNewPassword!: string;
}
