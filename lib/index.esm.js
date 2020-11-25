import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';
import vue from 'rollup-plugin-vue';
import analyze from 'rollup-plugin-analyzer';
import virtual from '@baleada/rollup-plugin-virtual';
import sourceTransform from '@baleada/rollup-plugin-source-transform';
import createFilesToIndex from '@baleada/source-transform-files-to-index';

function configureable(config = {}) {
  const object = {}; // Return the final config

  object.configure = () => config; // Generic


  object.input = file => configureable({ ...config,
    input: file
  }), object.plugin = plugin => configureable(push({
    config,
    array: 'plugins',
    value: plugin
  }));

  object.output = output => configureable(push({
    config,
    array: 'output',
    value: output
  }));

  object.external = external => configureable(push({
    config,
    array: 'external',
    value: external
  })); // Simple plugin additions


  object.resolve = (...args) => object.plugin(resolve(...args));

  object.vue = (...args) => object.plugin(vue(...args));

  object.delete = (...args) => object.plugin(del(...args));

  object.analyze = (...args) => object.plugin(analyze(...args));

  object.virtual = (...args) => object.plugin(virtual(...args));

  object.sourceTransform = (...args) => object.plugin(sourceTransform(...args)); // Babel


  object.toBabelConfig = target => {
    const sharedConfig = {
      plugins: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-transform-runtime'],
      babelHelpers: 'runtime',
      exclude: 'node_modules/**'
    };

    switch (target) {
      case 'browser':
        return {
          presets: [['@babel/preset-env', {
            targets: 'supports es6-module',
            modules: false // Don't transform modules

          }]],
          ...sharedConfig
        };

      case 'node':
        return {
          presets: [['@babel/preset-env', {
            targets: {
              node: true
            },
            modules: false // Don't transform modules

          }]],
          ...sharedConfig
        };
    }
  };

  object.babel = target => object.plugin(babel(object.toBabelConfig(target))).external(/@babel\/runtime/); // Virtual index


  object.virtualIndex = (path, createFilesToIndexOptions = {}) => {
    return object.virtual({
      test: ({
        id
      }) => id.endsWith(path),
      transform: createFilesToIndex({
        test: () => true,
        ...createFilesToIndexOptions
      })
    });
  }; // Standard configs for formats


  object.esm = ({
    file,
    target
  }) => {
    return object.output({
      file,
      format: 'esm'
    }).babel(target);
  };

  object.cjs = ({
    file
  }) => {
    return object.output({
      file,
      format: 'cjs'
    }).babel('node');
  };

  return object;
}
function push({
  config,
  array,
  value
}) {
  return { ...config,
    [array]: [...(config[array] || []), ...ensureArray(value)]
  };
}

function ensureArray(unknown) {
  return Array.isArray(unknown) ? unknown : [unknown];
}

export { configureable };