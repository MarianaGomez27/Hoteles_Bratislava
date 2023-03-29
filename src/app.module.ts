import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { UserModule } from './user/user.module';
import configuration, { HubSpotConfig } from './config/configuration';
import connectionOptions from '../ormconfig';
import { AllExceptionsFilter } from './all-exceptions.filter';
// import { SegmentModule } from './analytics';
import { AdminModule } from '@adminjs/nestjs';
import { setupCorsOrigin } from './utils/cors';
// import { FeatureFlagModule } from 'src/feature-flag';
import { EmailModule } from 'src/email/email.module';
// import { HubSpotModule } from 'src/integrations/hubspot/hubspot.module';
import { SlackModule } from 'src/integrations/slack/slack.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { PlaceModule } from './place/place.module';
import { MulterModule } from '@nestjs/platform-express';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import {
  DEFAULT_ADMIN,
  ADMIN_ROOT_PATH,
  ADMIN_COOKIE_PATH,
  ADMIN_SECRET,
  ADMIN_RESOURCES,
} from './adminjs';
import { PaymentsModule } from './integrations/payments/payments.module';

// TODO: Change this to authenticate with Auth0
const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Options here are forwarded to ApolloServer constructor
      typePaths: ['./**/*.graphql'],
      formatError: (err) => {
        // Mask sensitive details from any Axios error
        const exc = err.extensions?.exception as any;
        if (exc) {
          exc.headers = null;
          exc.baseURL = null;
        }

        return err;
      },
      context: ({ req }) => ({ headers: req.headers, req }),
      // cors: {
      //   credentials: true,
      //   origin: setupCorsOrigin,
      // },
    }),
    TypeOrmModule.forRoot({
      ...connectionOptions,
    }),
    // HubSpotModule.forRootAsync({
    //   imports: [ConfigModule, UserModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     accessToken: configService.get<HubSpotConfig>('hubspot').accessToken,
    //   }),
    // }),



    AuthModule,
    UserModule,
    // SegmentModule,
    // FeatureFlagModule,
    EmailModule,
    SlackModule,
    BookingModule,
    PlaceModule,
    NuiteeModule,
    PaymentsModule,
    MulterModule.register({
      dest: './uploads',
    }),
    // AdminModule.createAdminAsync({
    //   useFactory: () => ({
    //     adminJsOptions: {
    //       rootPath: ADMIN_ROOT_PATH,
    //       resources: ADMIN_RESOURCES,
    //     },
    //     auth: {
    //       authenticate,
    //       cookieName: ADMIN_COOKIE_PATH,
    //       cookiePassword: ADMIN_SECRET,
    //     },
    //     sessionOptions: {
    //       resave: true,
    //       saveUninitialized: true,
    //       secret: ADMIN_SECRET,
    //     },
    //   }),
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
