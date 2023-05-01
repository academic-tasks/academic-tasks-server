import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { GraphQLError } from 'graphql';
import { isEmpty, isObject } from 'lodash';
import { MeiliSearchModule } from 'src/app/meilisearch/meilisearch.module';
import { IS_PRODUCTION_MODE } from '../common/constants/IS_PRODUCTION_MODE.const';
import { AppContextModule } from './app-context/app-context.module';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { DateScalar } from './graphql/DateScalar';
import { HttpExceptionFilter } from './graphql/HttpExceptionFilter';
import { KCClientModule } from './kc-client/kc-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    //

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    //

    ScheduleModule.forRoot(),

    //

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      playground: true,
      introspection: true,

      debug: !IS_PRODUCTION_MODE,
      autoSchemaFile: true,

      cache: new InMemoryLRUCache({
        // ~100MiB
        maxSize: Math.pow(2, 20) * 100,

        // 5 minutes (in milliseconds)
        ttl: 300_000,
      }),

      // resolvers: { JSON: GraphQLJSON },

      formatError: (error: GraphQLError) => {
        // const graphQLFormattedError: GraphQLFormattedError = {
        //   message:
        //     (<any>error)?.extensions?.exception?.response?.message ||
        //     error?.message,
        // };

        // return graphQLFormattedError;

        const exception = error.extensions.exception as any;

        const exceptionStatus = exception?.status;
        const exceptionResponse = exception?.response;

        const aditionalErrorInfo = {
          ...(exceptionStatus === 422 &&
          isObject(exceptionResponse) &&
          !isEmpty(exceptionResponse)
            ? exceptionResponse
            : {}),
        };

        return {
          path: error.path,

          message: error.message,

          ...aditionalErrorInfo,
        };
      },
    }),

    //

    DatabaseModule,

    //

    AppContextModule,

    //

    KCClientModule,
    AuthModule,

    //

    MeiliSearchModule,

    //
  ],

  controllers: [
    //
    AppController,
  ],

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
