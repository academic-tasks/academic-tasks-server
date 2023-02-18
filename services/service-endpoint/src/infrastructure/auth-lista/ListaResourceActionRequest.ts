import {
  createListaAbility,
  ListaAbilities,
  ListaAbility,
  ListaRawRule,
} from '@academic-tasks/schemas';
import { detectSubjectType, ExtractSubjectType, subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { ForbiddenException } from '@nestjs/common';
import { pick } from 'lodash';
import { purify } from '../purify';

const getForbiddenErrorMessage = (
  action: string,
  subjectType: string,
  field?: string,
) =>
  purify(
    [
      `You are not allowed to perform the action '${action}'`,
      ` in the subject '${subjectType}'`,
      ...(field ? [` on field '${field}'`] : []),
      '.',
    ].join(''),
  );

export class ListaResourceActionRequest {
  ability!: ListaAbility;

  getAbility() {
    return this.ability;
  }

  constructor(regras: ListaRawRule[] = []) {
    this.ability = createListaAbility(regras);
  }

  static forSystemInternalActions() {
    return new ListaResourceActionRequest([
      { action: 'manage', subject: 'all' },
    ]);
  }

  ensurePermission<
    Action extends ListaAbilities[0],
    TargetSubject extends ListaAbilities[1],
  >(action: Action, targetSubject: TargetSubject, field?: string) {
    const ability = this.getAbility();

    if (ability.cannot(action, targetSubject, field)) {
      const subjectType =
        typeof targetSubject === 'string'
          ? targetSubject
          : detectSubjectType(targetSubject as any);

      throw new ForbiddenException(
        getForbiddenErrorMessage(action, <string>subjectType, field),
      );
    }
  }

  readResource<
    TargetSubject extends ExtractSubjectType<ListaAbilities[1]>,
    Resource,
  >(targetSubject: TargetSubject, resource: Resource): Partial<Resource> {
    const resourceWithSubject = subject(targetSubject as any, <any>resource);

    this.ensurePermission('read', resourceWithSubject);

    const permittedFields = this.getPermittedFields(
      'read',
      resourceWithSubject,
    );

    return permittedFields === true
      ? resource
      : pick(resource, permittedFields);
  }

  updateResource<
    TargetSubject extends ExtractSubjectType<ListaAbilities[1]>,
    IncomingResource,
    IncomingChanges extends Partial<IncomingChanges>,
    UpdatedResource extends IncomingResource,
  >(
    targetSubject: TargetSubject,
    resource: IncomingResource,
    incomingChanges: IncomingChanges,
    action: 'update' | 'create' = 'update',
  ): UpdatedResource {
    const resourceWithSubject = subject(targetSubject as any, <any>resource);

    const permittedFields = this.getPermittedFields(
      action,
      resourceWithSubject,
    );

    const changes =
      permittedFields === true
        ? incomingChanges
        : pick(incomingChanges, permittedFields);

    return Object.assign({}, resource, changes) as UpdatedResource;
  }

  getPermittedFields(
    action: ListaAbilities[0],
    subject: ListaAbilities[1],
  ): string[] | true {
    const ability = this.getAbility();

    const defaultFields = ['_____DEFAULT_____'];

    const fields = permittedFieldsOf(ability, action, subject, {
      fieldsFrom: (rule): any => rule.fields || defaultFields,
    });

    if (JSON.stringify(fields) === JSON.stringify(defaultFields)) {
      return true;
    }

    return fields;
  }
}
