module.exports = {
  extends: ['react-app', 'airbnb'],
  env: {
    jest: true,
    browser: true,
  },
  rules: {
    'react/jsx-filename-extension': 0, // Allow .jsx filename extension
    "linebreak-style": 0
  }
};
