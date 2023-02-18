import {
  AppAction,
  AppSubject,
  Cargo,
  IAddPermissaoToCargoInput,
  ICreateCargoInput,
  IDeleteCargoInput,
  IFindCargoByIdInput,
  IRemovePermissaoFromCargoInput,
  IUpdateCargoInputZod,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { parralel } from 'src/app/helpers';
import { ICargoRepository } from 'src/app/repositories/cargo.repository';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import {
  REPOSITORY_CARGO,
  REPOSITORY_CARGO_HAS_PERMISSAO,
  REPOSITORY_PERMISSAO,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { CargoDbEntity } from '../../entities/cargo.db.entity';
import { PermissaoDbEntity } from '../../entities/permissao.db.entity';
import { ICargoHasPermissaoRepository } from '../../repositories/cargo-has-permissao.repository';
import { IPermissaoRepository } from '../../repositories/permissao.repository';
import { PermissoesService } from '../permissao/permissao.service';

@Injectable()
export class CargoService {
  constructor(
    private permissoeservice: PermissoesService,
    //
    @Inject(REPOSITORY_CARGO)
    private cargoRepository: ICargoRepository,
    @Inject(REPOSITORY_PERMISSAO)
    private permissaoRepository: IPermissaoRepository,
    @Inject(REPOSITORY_CARGO_HAS_PERMISSAO)
    private cargoHasPermissaoRepository: ICargoHasPermissaoRepository,
  ) {}

  async findCargoById(
    resourceActionRequest: ResourceActionRequest,
    dto: IFindCargoByIdInput,
    options: FindOneOptions<CargoDbEntity> | null = null,
  ) {
    const { id } = dto;

    const targetCargo = await this.cargoRepository.findOne({
      where: { id },
      select: ['id'],
    });

    if (!targetCargo) {
      throw new NotFoundException();
    }

    const cargo = await this.cargoRepository.findOneOrFail({
      where: { id: targetCargo.id },
      select: ['id'],
      ...options,
    });

    return resourceActionRequest.readResource(AppSubject.CARGO, cargo);
  }

  async findCargoByIdSimple(
    resourceActionRequest: ResourceActionRequest,
    cargoId: string,
  ): Promise<Pick<CargoDbEntity, 'id'>> {
    const cargo = await this.findCargoById(resourceActionRequest, {
      id: cargoId,
    });

    return cargo as Pick<CargoDbEntity, 'id'>;
  }

  async findCargosByIds(
    resourceActionRequest: ResourceActionRequest,
    cargosIds: string[],
  ) {
    const cargos = await parralel(cargosIds, (cargoId) =>
      this.findCargoByIdSimple(resourceActionRequest, cargoId),
    );

    return cargos as Cargo[];
  }

  async findCargoHasPermissao(
    resourceActionRequest: ResourceActionRequest,
    cargoId: string,
    permissaoId: string,
  ) {
    const cargo = await this.findCargoByIdSimple(
      resourceActionRequest,
      cargoId,
    );

    const permissao = await this.permissoeservice.findPermissaoByIdSimple(
      resourceActionRequest,
      permissaoId,
    );

    const cargoHasPermissao = await this.cargoHasPermissaoRepository.findOne({
      where: {
        permissao: { id: permissao.id },
        cargo: { id: cargo.id },
      },
      select: ['id'],
    });

    return cargoHasPermissao;
  }

  async getCargoGenericField<K extends keyof CargoDbEntity>(
    resourceActionRequest: ResourceActionRequest,
    cargoId: string,
    field: K,
  ): Promise<CargoDbEntity[K]> {
    const cargo = await this.findCargoById(
      resourceActionRequest,
      { id: cargoId },
      { select: ['id', field] },
    );

    resourceActionRequest.ensurePermission(
      AppAction.READ,
      subject(AppSubject.CARGO, cargo),
      field,
    );

    return <CargoDbEntity[K]>cargo[field];
  }

  async getCargoName(
    resourceActionRequest: ResourceActionRequest,
    cargoId: string,
  ): Promise<CargoDbEntity['name']> {
    return this.getCargoGenericField(resourceActionRequest, cargoId, 'name');
  }

  async getCargoPermissoes(
    resourceActionRequest: ResourceActionRequest,
    cargoId: string,
  ): Promise<PermissaoDbEntity[]> {
    const cargo = await this.findCargoByIdSimple(
      resourceActionRequest,
      cargoId,
    );

    const permissoesQuery = this.permissaoRepository
      .createQueryBuilder('permissao')
      .innerJoin('permissao.cargoHasPermissao', 'cargo_has_permissao')
      .select(['permissao.id'])
      .where('cargo_has_permissao.id_cargo_fk = :id', { id: cargo.id });

    const permissoes = await permissoesQuery.getMany();

    return permissoes;
  }

  async getCargoRecipes(
    resourceActionRequest: ResourceActionRequest,
    cargoId: string,
  ): Promise<string[]> {
    const cargo = await this.findCargoByIdSimple(
      resourceActionRequest,
      cargoId,
    );

    const permissoes = await this.getCargoPermissoes(
      resourceActionRequest,
      cargo.id,
    );

    const recipes = await parralel(permissoes, (permissao) =>
      this.permissoeservice.getPermissaoRecipe(
        resourceActionRequest,
        permissao.id,
      ),
    );

    return recipes;
  }

  async getCargosRecipes(
    resourceActionRequest: ResourceActionRequest,
    cargos: Pick<Cargo, 'id'>[],
  ) {
    const recipes: string[] = await parralel(
      cargos,
      (cargo: Pick<Cargo, 'id'>) =>
        this.getCargoRecipes(resourceActionRequest, cargo.id),
    ).then((cargosRecipes) => cargosRecipes.flat(1));

    return recipes;
  }

  async createCargo(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreateCargoInput,
  ) {
    const fieldsData = omit(dto, []);

    const cargo = resourceActionRequest.updateResource(
      AppSubject.CARGO,
      <CargoDbEntity>{},
      fieldsData,
      AppAction.CREATE,
    );

    CargoDbEntity.setupInitialIds(cargo);

    resourceActionRequest.ensurePermission(
      AppAction.CREATE,
      subject(AppSubject.CARGO, cargo),
    );

    await this.cargoRepository.save(cargo);

    return this.findCargoByIdSimple(resourceActionRequest, cargo.id);
  }

  async updateCargo(
    resourceActionRequest: ResourceActionRequest,
    dto: IUpdateCargoInputZod,
  ) {
    const { id } = dto;

    const cargo = await this.findCargoByIdSimple(resourceActionRequest, id);

    const fieldsData = omit(dto, ['id']);

    const updatedCargo = resourceActionRequest.updateResource(
      AppSubject.CARGO,
      <CargoDbEntity>cargo,
      fieldsData,
    );

    resourceActionRequest.ensurePermission(
      'update',
      subject(AppSubject.CARGO, cargo),
    );

    await this.cargoRepository.save(updatedCargo);

    return this.findCargoByIdSimple(resourceActionRequest, cargo.id);
  }

  async deleteCargo(
    resourceActionRequest: ResourceActionRequest,
    dto: IDeleteCargoInput,
  ) {
    const cargo = await this.findCargoByIdSimple(resourceActionRequest, dto.id);

    resourceActionRequest.ensurePermission(
      AppAction.DELETE,
      subject(AppSubject.CARGO, cargo),
    );

    await this.cargoRepository.delete(cargo.id);

    return true;
  }

  async addPermissaoToCargo(
    resourceActionRequest: ResourceActionRequest,
    dto: IAddPermissaoToCargoInput,
  ) {
    const { cargoId, permissaoId } = dto;

    const cargo = await this.findCargoByIdSimple(
      resourceActionRequest,
      cargoId,
    );

    const permissao = await this.permissoeservice.findPermissaoByIdSimple(
      resourceActionRequest,
      permissaoId,
    );

    const cargoHasPermissaoAlreadyExists = await this.findCargoHasPermissao(
      resourceActionRequest,
      cargo.id,
      permissao.id,
    );

    if (cargoHasPermissaoAlreadyExists) {
      return true;
    }

    const cargoHasPermissao = this.cargoHasPermissaoRepository.create();
    cargoHasPermissao.cargo = <CargoDbEntity>{ id: cargo.id };
    cargoHasPermissao.permissao = <PermissaoDbEntity>{ id: permissao.id };
    await this.cargoHasPermissaoRepository.save(cargoHasPermissao);

    return true;
  }

  async removePermissaoFromCargo(
    resourceActionRequest: ResourceActionRequest,
    dto: IRemovePermissaoFromCargoInput,
  ) {
    const { cargoId, permissaoId } = dto;

    const cargo = await this.findCargoByIdSimple(
      resourceActionRequest,
      cargoId,
    );

    const permissao = await this.permissoeservice.findPermissaoByIdSimple(
      resourceActionRequest,
      permissaoId,
    );

    const cargoHasPermissalAlreadyExists = await this.findCargoHasPermissao(
      resourceActionRequest,
      cargo.id,
      permissao.id,
    );

    if (!cargoHasPermissalAlreadyExists) {
      return true;
    }

    await this.cargoHasPermissaoRepository.delete({
      cargo: { id: cargo.id },
      permissao: { id: permissao.id },
    });

    return true;
  }
}
