import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,

  ignores: [
    'node_modules/**/*',
    'mock/**/*',
    'old/**/*',
    'docs/**/*',
    'public/**/*',
    'assets',
  ],
}, {
  rules: {
    'no-undef': 'off',
  },
})
