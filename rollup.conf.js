const rollup = require('rollup');
const { uglify } = require('rollup-plugin-uglify');
const { getRollupPlugins, getExternal } = require('./scripts/util');

const DIST = 'dist';
const FILENAME = 'index';

const external = getExternal();
const rollupConfig = [
  {
    input: {
      input: 'src/index.ts',
      plugins: getRollupPlugins(),
      external,
    },
    output: {
      format: 'cjs',
      file: `${DIST}/${FILENAME}.common.js`,
    },
  },
  {
    input: {
      input: 'src/index.ts',
      plugins: getRollupPlugins({ browser: true }),
    },
    output: {
      format: 'umd',
      file: `${DIST}/${FILENAME}.js`,
      name: 'JSX',
    },
    minify: true,
  },
];
// Generate minified versions
rollupConfig.filter(({ minify }) => minify)
.forEach(config => {
  rollupConfig.push({
    input: {
      ...config.input,
      plugins: [
        ...config.input.plugins,
        uglify(),
      ],
    },
    output: {
      ...config.output,
      file: config.output.file.replace(/\.js$/, '.min.js'),
    },
  });
});

module.exports = rollupConfig.map(config => ({
  ...config.input,
  output: config.output,
}));
