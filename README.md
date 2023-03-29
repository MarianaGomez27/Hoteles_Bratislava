Backend monolith for triptech web application. Built using [Nest](https://github.com/nestjs/nest).

## Prequisites

- Node v14+ (install with [nvm](https://github.com/nvm-sh/nvm))
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- [Docker](https://docs.docker.com/desktop/mac/install/)

## Installation

```bash
$ yarn
```

## Running the app

```bash
# watch mode + generate types
$ npm run dev

# production mode
$ npm run start:prod
```

## Running backing services

The app requires a Postgres database to store data in. It can be started via docker compose:

```bash
$ npm run start:db
```

## Building and bundling the app

```bash
$ npm build
```

The build step is the standard `nest build` command, with an additional step to copy `.graphql` files into the `/dist` folder.

## Deploying the app

TO BE DOCUMENTED

## Environment variables

Environment variables are loaded on start from the `.env` file (which is ignored by git). Values for these variables can be found in the 1Password Engineers vaule under "Local env vars".

To add a new environment variable, simply add a new line to the .env file. When commiting this change, be sure to add the empty value to `.env.local` and a completed value into 1Password so other engineers can access it.

This can then be added to the ConfigModule in `src/config/configuration.ts` and accessed via ConfigModule which is imported globally so available in all other modules.

New environment variables on deploy are added manually when deployed and should be sent beforehand

## Running tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Code structure

The app is organised into modules. Modules live under the `src` folder. Each module should be an isolated domain, which can be reused in other modules.
Modules can contain controllers (REST endpoints).
Modules can also contain resolvers (similar to an endpoint) which is resolved via graphql for communication with clients.

In theory each module should be able to be separated into its own microservice eventually.

## Generating types

The `generateTypes` npm script runs the `generate-typings.ts` script and watches for any changes in `.graphql` files. On any change, a new set of types will be generated in `graphql.ts` which are then usable across the application.

## Migrations
```bash
# Generate a new migration
npm run typeorm migration:generate -n NameOfYourMigration -d migrations

# Run the migration
npm run typeorm migration:run

# Revert to latest migration
npm run typeorm migration:revert
```

## Development workflow

Code should be written schema first, meaning the graphql schema should be defined, reviewed, and commited before any other work. This enables us to split backend and frontend work using a single shared schema, and reduces the amount of TypeScript types we need to define manually.

## Data layer

Data access is handled by [typeorm](https://typeorm.io/#/). `.entity` files define the structure of the data and enable query building with types.
