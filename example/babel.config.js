const utils = require('./scripts/utils.config');

const alias = {};
utils.kvs.forEach((element) => {
  Object.defineProperties(alias, Object.getOwnPropertyDescriptors(element));
});

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: alias,
        },
      ],
      [
        'react-native-reanimated/plugin',
        {
          relativeSourceLocation: true,
        },
      ],
    ],
  };
};
