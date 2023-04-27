import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { AuthModule } from '../auth/auth.module';
import { IS_PRODUCTION_MODE } from '../common/constants/IS_PRODUCTION_MODE.const';
import { DatabaseModule } from '../database/database.module';
import { DateScalar } from '../graphql/DateScalar';
import { HttpExceptionFilter } from '../graphql/HttpExceptionFilter';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';

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
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            (<any>error)?.extensions?.exception?.response?.message ||
            error?.message,
        };

        return graphQLFormattedError;
      },
    }),

    //

    DatabaseModule,

    //

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
