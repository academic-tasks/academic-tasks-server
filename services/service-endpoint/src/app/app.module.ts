import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import GraphQLJSON from 'graphql-type-json';
import { AuthModule } from '../infrastructure/auth/auth.module';
import { IS_PRODUCTION_MODE } from '../infrastructure/consts/IS_PRODUCTION_MODE.const';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { DateScalar } from '../infrastructure/graphql/DateScalar';
import { HttpExceptionFilter } from '../infrastructure/graphql/HttpExceptionFilter';
import { AppResolver } from './app.resolver';
import { CargoModule } from './modules/cargo/cargo.module';
import { CursoModule } from './modules/curso/curso.module';
import { DisciplinaProfessorModule } from './modules/disciplina-professor/disciplina-professor.module';
import { DisciplinaModule } from './modules/disciplina/disciplina.module';
import { ListaMembroModule } from './modules/lista-membro/lista-membro.module';
import { ListaModule } from './modules/lista/lista.module';
import { PermissaoModule } from './modules/permissao/permissao.module';
import { ProfessorModule } from './modules/professor/professor.module';
import { TarefaModule } from './modules/tarefa/tarefa.module';
import { TurmaModule } from './modules/turma/turma.module';
import { UsuarioModule } from './modules/usuario/usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      playground: true,
      introspection: true,

      debug: !IS_PRODUCTION_MODE,

      autoSchemaFile: true,

      resolvers: { JSON: GraphQLJSON },
    }),

    //

    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    DatabaseModule,
    AuthModule,

    //

    UsuarioModule,
    PermissaoModule,
    CargoModule,

    //

    CursoModule,

    TurmaModule,

    ProfessorModule,

    DisciplinaModule,
    DisciplinaProfessorModule,

    ListaModule,
    ListaMembroModule,

    TarefaModule,
  ],

  controllers: [],

  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    DateScalar,
    AppResolver,
  ],
})
export class AppModule {}
