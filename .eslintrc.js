module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2020,
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1,
        'CallExpression': {
          'arguments': 'first',
        },
        'FunctionDeclaration': {
          'parameters': 'first',
        },
        'FunctionExpression': {
          'parameters': 'first',
        },
        'ImportDeclaration': 1,
      },
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'comma-dangle': [
      'error',
      {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'ignore',
      },
    ],
    'brace-style': [
      'error',
      'stroustrup',
      {
        'allowSingleLine': false,
      },
    ],
    'no-var': 2,
    'no-multiple-empty-lines': 'error',
    'prefer-const': 'error',
    'space-before-function-paren': 'error',
    'curly': ['error', 'all'],
    'space-before-blocks': ['error', 'always'],
    'keyword-spacing': ['error'],
    'comma-spacing': ['error'],
    'object-curly-newline': ['error', { 'consistent': true }],
    'max-len': ['error', {
      code: 80,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    // I wish to make inferrable types required, but that doesn't seem to be
    // an option so in order to keep code consistent we'll forbid it
    '@typescript-eslint/no-inferrable-types': 2,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
  },
  'overrides': [
    {
      'files': [
        'tests/*.test.ts',
      ],
      'env': {
        'jest': true, // now **/*.test.js files' env has both es6 *and* jest
      },
      // Can't extend in overrides: https://github.com/eslint/eslint/issues/8813
      // 'extends': ['plugin:jest/recommended']
      'plugins': ['jest'],
      'rules': {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
  ],
};
