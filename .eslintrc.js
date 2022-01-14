const path = require('path');

module.exports = {
  root: true,
  'settings': {
    "import/resolver": {
      "webpack": {
        "config": path.join(__dirname, './webpack.dev.config.js')
      }
    }
  },
  parser: "vue-eslint-parser",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  rules: {
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never',
      'json': 'never',
      "jsx": 'never',
    }]
  },
  "extends": ["plugin:import/recommended"]
}