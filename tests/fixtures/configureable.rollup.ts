export const babelConfigShared = {
  plugins: [
    '@babel/plugin-transform-nullish-coalescing-operator',
    '@babel/plugin-transform-optional-chaining',
    [
      '@babel/plugin-transform-runtime',
      { useESModules: true }
    ]
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
