import { Inject, Injectable } from '@nestjs/common';
import { IListaMembroRepository } from 'src/app/repositories/lista-membro.repository';
import { REPOSITORY_LISTA_MEMBRO } from '../../../infrastructure/database/constants/REPOSITORIES.const';

@Injectable()
export class ListaMembroService {
  constructor(
    @Inject(REPOSITORY_LISTA_MEMBRO)
    private listaMembroRepository: IListaMembroRepository,
  ) {}
}
