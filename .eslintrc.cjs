module.exports = {
  root: true,
  env: { es2020: true, es6: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    '.eslintrc.cjs',
    'prettier.config.js',
    'node_modules',
    'environment.d.ts',
  ],
  plugins: ['import', 'prettier', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    'class-methods-use-this': 'off',
    'no-process-exit': 'off',
    'no-restricted-syntax': 'off',
    'node/no-unpublished-import': 'off',
    'node/no-missing-import': 'off',
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: ['modules'],
      },
    ],
    'sort-imports': [
      'error',
      { ignoreCase: true, ignoreDeclarationSort: true },
    ],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': ['error', 'never'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['sibling', 'parent'],
          'index',
        ],
        pathGroups: [
          {
            pattern: 'node',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['internal'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
