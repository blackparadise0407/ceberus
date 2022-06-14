import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttachmentModule } from './attachment/attachment.module';
import { AuthModule } from './auth/auth.module';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';
import { TagModule } from './tag/tag.module';
import { TweetModule } from './tweet/tweet.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('db.host'),
        port: config.get<number>('db.port'),
        username: config.get<string>('db.username'),
        password: config.get<string>('db.password'),
        database: config.get<string>('db.name'),
        entities: [join(__dirname, '**/*.entity{.ts,.js}')],
        synchronize: true,
        useUTC: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: AppModule.isDev,
      playground: AppModule.isDev,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      cors: {
        origin: '*',
        credentials: true,
      },
    }),
    UserModule,
    AuthModule,
    TagModule,
    TweetModule,
    AttachmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public static port: number;
  public static isDev: boolean;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = configService.get<number>('app.port');
    AppModule.isDev = process.env.NODE_ENV === 'development';
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
