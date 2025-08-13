module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-flow'
  ],
  plugins: [
    'react-native-worklets/plugin',
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-class-properties', { loose: true }]
  ],
  overrides: [
    {
      test: ['./node_modules/victory-native'],
      presets: ['module:metro-react-native-babel-preset']
    }
  ]
};
