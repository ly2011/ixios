module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: [],
  env: {
    browser: true,
    node: true,
    es6: true,
    commonjs: true,
    jest: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true
  },
  rules: {
    'class-methods-use-this': 'off',
    'comma-dangle': 'off',
    'global-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'no-plusplus': 'off',
    'no-console': 'off',
    'no-await-in-loop': 'off',
    'no-new': 'off',
    'max-len': 'off',
    'no-underscore-dangle': 'off'
  }
}
