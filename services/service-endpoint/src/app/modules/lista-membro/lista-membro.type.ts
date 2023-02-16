import { Lista, ListaMembro, Usuario } from '@academic-tasks/schemas';

export class ListaMembroType implements ListaMembro {
  id!: string;
  lista!: Lista;
  usuario!: Usuario;
}
