import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
// Generate different files for convenience and separation.
// It helps to distinguish things when we do an import
// Note: When the monolith gets instantiated (See: app.module.ts)
// The different graphql files are all merged and inserted into the same Apollo server
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql.ts'),
  outputAs: 'class',
  watch: true,
});