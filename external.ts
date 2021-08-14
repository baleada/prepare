export const external = [
  // rollup
  '@rollup/plugin-babel',
  '@rollup/plugin-commonjs',
  '@rollup/plugin-json',
  '@rollup/plugin-node-resolve',
  '@rollup/plugin-multi-entry',
  '@rollup/plugin-typescript',
  'rollup-plugin-delete',
  'rollup-plugin-dts',
  'rollup-plugin-vue',
  'rollup-plugin-esbuild',
  /esbuild/,
  'rollup-plugin-analyzer',
  '@baleada/rollup-plugin-virtual',
  '@baleada/rollup-plugin-source-transform',
  
  // markdown-it
  '@baleada/markdown-it-spa-links',
  '@baleada/markdown-it-prose-container',
  '@baleada/markdown-it-text-content',
  'markdown-it',
  'refractor',
  'rehype',
  'markdown-it-link-attributes',
  
  // vite
  '@vitejs/plugin-vue',
  'vite-plugin-pages',

  // browser controlling
  'puppeteer-core',
  'playwright-core',
  
  // tailwind
  '@baleada/tailwind-theme',
  '@baleada/tailwind-theme-utils',
  '@baleada/tailwind-linear-numeric',
  '@tailwindcss/forms',
  '@tailwindcss/typography',
  '@tailwindcss/line-clamp',
  '@tailwindcss/aspect-ratio',

  // postcss
  'postcss',
  'purgecss',
  'postcss-import',
  'postcss-nested',
  /tailwindcss(\/|$)/,
  'autoprefixer',
  
  // babel
  '@babel/preset-env',
  '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-transform-runtime',

  // misc
  'parse5',
  '@rollup/pluginutils',
  'path',
  'fs',
  'query-string',
]
