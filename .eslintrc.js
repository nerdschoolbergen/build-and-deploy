module.exports = {
  extends: ['react-app', 'airbnb'],
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
    'max-len': [
      2,
      {
        code: 100,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
  },
}