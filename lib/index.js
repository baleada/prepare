'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var babel = require('@rollup/plugin-babel');
var resolve = require('@rollup/plugin-node-resolve');
var del = require('rollup-plugin-delete');
var vue = require('rollup-plugin-vue');
var analyze = require('rollup-plugin-analyzer');
var virtual = require('@baleada/rollup-plugin-virtual');
var sourceTransform = require('@baleada/rollup-plugin-source-transform');
var createFilesToIndex = require('@baleada/source-transform-files-to-index');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var babel__default = /*#__PURE__*/_interopDefaultLegacy(babel);
var resolve__default = /*#__PURE__*/_interopDefaultLegacy(resolve);
var del__default = /*#__PURE__*/_interopDefaultLegacy(del);
var vue__default = /*#__PURE__*/_interopDefaultLegacy(vue);
var analyze__default = /*#__PURE__*/_interopDefaultLegacy(analyze);
var virtual__default = /*#__PURE__*/_interopDefaultLegacy(virtual);
var sourceTransform__default = /*#__PURE__*/_interopDefaultLegacy(sourceTransform);
var createFilesToIndex__default = /*#__PURE__*/_interopDefaultLegacy(createFilesToIndex);

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


  object.resolve = (...args) => object.plugin(resolve__default['default'](...args));

  object.vue = (...args) => object.plugin(vue__default['default'](...args));

  object.delete = (...args) => object.plugin(del__default['default'](...args));

  object.analyze = (...args) => object.plugin(analyze__default['default'](...args));

  object.virtual = (...args) => object.plugin(virtual__default['default'](...args));

  object.sourceTransform = (...args) => object.plugin(sourceTransform__default['default'](...args)); // Babel


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
            targets: 'supports es6-modules',
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

  object.babel = target => object.plugin(babel__default['default'](object.toBabelConfig(target))).external(/@babel\/runtime/); // Virtual index


  object.virtualIndex = (path, createFilesToIndexOptions = {}) => {
    return object.virtual({
      test: ({
        id
      }) => id.endsWith(path),
      transform: createFilesToIndex__default['default']({
        test: () => true,
        createFilesToIndexOptions
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

exports.configureable = configureable;
