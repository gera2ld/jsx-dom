module.exports = {
  extends: require.resolve('@gera2ld/plaid/config/babelrc-base'),
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      { runtime: 'automatic', importSource: __dirname + '/test' },
    ],
  ],
  plugins: [
  ].filter(Boolean),
};
