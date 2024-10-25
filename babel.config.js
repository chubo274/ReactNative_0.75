module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        cwd: 'babelrc',
        extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        alias: {
          shared: './src/shared/',
          components: './src/modules/components/',
          screen: './src/modules/screen/',
          src: './src/',
        },
      },
    ],
    'jest-hoist',
    // Set 'loose' mode to true for consistency across the plugins
    ['@babel/plugin-transform-private-methods', {loose: true}],
    ['@babel/plugin-transform-class-properties', {loose: true}],
    ['@babel/plugin-transform-private-property-in-object', {loose: true}],
    // Uncomment 'react-native-reanimated/plugin' if you're using Reanimated
    // 'react-native-reanimated/plugin',
  ],
};
