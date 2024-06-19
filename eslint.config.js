import antfu from '@antfu/eslint-config'

export default antfu({
  svelte: true,
  rules: {
    'style/brace-style': ['error', '1tbs'],
    'style/arrow-parens': ['error', 'always'],
    'curly': ['error', 'all'],
    'antfu/consistent-list-newline': 'off',
    'no-console': 'off',
    'node/prefer-global/process': 'off',
  },
}, {
  ignores: [
    '.github',
    'dist',
    'node_modules',
    '.svelte-kit',
    'build',
  ],
})
