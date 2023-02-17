import {
  camelCase,
  constantCase,
  paramCase,
  pascalCase,
  snakeCase,
} from 'change-case';

const MODULE_FILES_TS = ['dtos/index'];
const MODULE_FILES_TS_ROOT = ['module', 'service', 'resolver', 'type'];
const MODULE_FILES_DTO_BASE = ['Create', 'Delete', 'FindById', 'Update'];

export default function (
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
  plop.setHelper('camelCase', (text) => camelCase(text));
  plop.setHelper('constantCase', (text) => constantCase(text));
  plop.setHelper('paramCase', (text) => paramCase(text));
  plop.setHelper('pascalCase', (text) => pascalCase(text));
  plop.setHelper('snakeCase', (text) => snakeCase(text));

  // create your generators here
  plop.setGenerator('module', {
    description: 'application module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'module name please',
      },
    ], // array of inquirer prompts
    actions: [
      ...MODULE_FILES_TS_ROOT.map((rootFile) => ({
        type: 'add',
        path: `src/app/modules/{{paramCase name}}/{{paramCase name}}.${rootFile}.ts`,
        templateFile: `plop-templates/module/${rootFile}.hbs`,
      })),

      ...MODULE_FILES_TS.map((path) => ({
        type: 'add',
        path: `src/app/modules/{{paramCase name}}/${path}.ts`,
        templateFile: `plop-templates/module/${path}.hbs`,
      })),

      ...MODULE_FILES_DTO_BASE.map((baseName) => ({
        type: 'add',
        path: `src/app/modules/{{paramCase name}}/dtos/${baseName}{{ pascalCase name }}.input.type.ts`,
        templateFile: `plop-templates/module/dtos/${baseName}.hbs`,
      })),
    ], // array of actions
  });
}
