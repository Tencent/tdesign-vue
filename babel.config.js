module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            'last 3 Chrome versions',
            'last 3 Firefox versions',
            'Safari >= 10',
            'Explorer >= 11',
            'Edge >= 12',
          ],
          esmodules: true,
        },
        modules: false,
      },
    ],
    '@vue/babel-preset-jsx',
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
            modules: 'commonjs',
          },
        ],
        '@vue/babel-preset-jsx',
      ],
    },
    production: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
          },
        ],
        '@vue/babel-preset-jsx',
      ],
      plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-class-properties'],
    },
  },
};
