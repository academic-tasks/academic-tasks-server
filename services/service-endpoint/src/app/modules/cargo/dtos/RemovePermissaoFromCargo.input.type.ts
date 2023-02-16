import { IRemovePermissaoFromCargoInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemovePermissaoFromCargoInputType
  implements IRemovePermissaoFromCargoInput
{
  @Field()
  cargoId!: string;

  @Field()
  permissaoId!: string;
}
