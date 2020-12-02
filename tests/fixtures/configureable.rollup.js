export const babelConfigShared = {
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-transform-runtime',
  ],
  babelHelpers: 'runtime',
  exclude: 'node_modules/**',
}

export const babelConfigBrowser = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'supports es6-module',
        modules: false,
      }
    ]
  ],
  ...babelConfigShared,
}

export const babelConfigNode = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: true },
        modules: false,
      }
    ]
  ],
  ...babelConfigShared,
}
