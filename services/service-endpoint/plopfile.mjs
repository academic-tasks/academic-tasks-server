import {
  camelCase,
  constantCase,
  paramCase,
  pascalCase,
  snakeCase,
} from 'change-case';

const MODULE_FILES_TS = ['dtos/index'];
const MODULE_FILES_TS_ROOT = ['module', 'service', 'resolver', 'type'];
const MODULE_FILES_DTO_BASE = [
  'Create{}',
  'Delete{}',
  'Find{}ById',
  'Update{}',
];

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
        skipIfExists: true,
      })),

      ...MODULE_FILES_TS.map((path) => ({
        type: 'add',
        path: `src/app/modules/{{paramCase name}}/${path}.ts`,
        templateFile: `plop-templates/module/${path}.hbs`,
        skipIfExists: true,
      })),

      ...MODULE_FILES_DTO_BASE.map((baseName) => ({
        input: baseName.replace('{}', ''),
        output: baseName.replace('{}', '{{ pascalCase name }}'),
      })).map(({ input, output }) => ({
        type: 'add',
        path: `src/app/modules/{{paramCase name}}/dtos/${output}.input.type.ts`,
        templateFile: `plop-templates/module/dtos/${input}.hbs`,
        skipIfExists: true,
      })),
    ], // array of actions
  });
}
