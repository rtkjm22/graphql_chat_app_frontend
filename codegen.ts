
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000",
  documents: "src/graphql/**/*.tsx",
  generates: {
    "src/graphql/": {
      preset: "client",
      plugins: ['typescript']
    }
  }
};

export default config;
