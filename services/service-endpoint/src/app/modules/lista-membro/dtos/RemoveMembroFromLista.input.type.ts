import { IRemoveMembroFromListaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveMembroFromListaInputType
  implements IRemoveMembroFromListaInput
{
  @Field(() => String)
  listaId!: string;

  @Field(() => String)
  usuarioId!: string;
}
