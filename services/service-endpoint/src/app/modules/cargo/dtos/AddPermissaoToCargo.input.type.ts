import { IAddPermissaoToCargoInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddPermissaoToCargoInputType implements IAddPermissaoToCargoInput {
  @Field(() => String)
  cargoId!: string;

  @Field(() => String)
  permissaoId!: string;
}
