module.exports = {
  extends: ['airbnb'],
  parser: 'babel-eslint',
  env: {
    jest: true,
    browser: true,
  },
  rules: {
    'linebreak-style': 0,
    'react/jsx-filename-extension': 0,
    'react/no-unused-prop-types': [
      2,
      {
        skipShapeProps: true,
      },
    ],
    'react/forbid-prop-types': 0,
  },
};
