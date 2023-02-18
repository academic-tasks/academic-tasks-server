import { IAddMembroToListaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddMembroToListaInputType implements IAddMembroToListaInput {
  @Field(() => String)
  listaId!: string;

  @Field(() => String)
  usuarioId!: string;
}
