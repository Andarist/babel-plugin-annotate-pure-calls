module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
        targets: {
          node: 4
        },
      },
    ],
  ],
  plugins: ['@babel/transform-modules-commonjs'],
}
