module.exports = {
  root: true,
  extends: [
    'standard',
    'plugin:vue/recommended'
  ],
  rules: {
    indent: ['error', 2, { MemberExpression: 'off' }],
    "no-undef": ["error"],
    'operator-linebreak': ["error", "before"],
    "space-before-function-paren": ["error", {"anonymous": "always", "named": "never", "asyncArrow": "always"}],
  }
}
