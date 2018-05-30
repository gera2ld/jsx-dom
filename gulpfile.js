const path = require('path');
const gulp = require('gulp');
const log = require('fancy-log');
const rollup = require('rollup');
const del = require('del');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const pkg = require('./package.json');

const DIST = 'lib';
const IS_PROD = process.env.NODE_ENV === 'production';
const values = {
  'process.env.VERSION': pkg.version,
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
};


const commonConfig = {
  input: {
    plugins: [
      // Note: rollup-plugin-babel does not support targeting latest versions
      // See https://github.com/rollup/rollup-plugin-babel/issues/212
      babel({
        exclude: 'node_modules/**',
        externalHelpers: true,
      }),
      replace({ values }),
    ],
  },
};
const rollupConfig = [
  {
    input: {
      ...commonConfig.input,
      input: 'src/index.js',
    },
    output: {
      ...commonConfig.output,
      format: 'cjs',
      file: `${DIST}/index.js`,
    },
  },
];

function clean() {
  return del(DIST);
}

function buildJs() {
  return Promise.all(rollupConfig.map(config => {
    return rollup.rollup(config.input)
    .then(bundle => bundle.write(config.output))
    .catch(err => {
      log(err.toString());
    });
  }));
}

function watch() {
  gulp.watch('src/**', buildJs);
}

exports.clean = clean;
exports.build = buildJs;
exports.dev = gulp.series(buildJs, watch);
