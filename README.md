# @gera2ld/jsx-dom

![NPM](https://img.shields.io/npm/v/@gera2ld/jsx-dom.svg)
![License](https://img.shields.io/npm/l/@gera2ld/jsx-dom.svg)
![Downloads](https://img.shields.io/npm/dt/@gera2ld/jsx-dom.svg)

This is an ES6 project built with yeoman and generator-rollup.

## Usage

```sh
$ yarn add @gera2ld/jsx-dom
# ESLint
$ yarn add eslint-plugin-react -D
```

```js
import h from '@gera2ld/jsx-dom';

document.body.appendChild(<div>hello</div>);
```

```js
// .babelrc
{
  // ...
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "h",
    }],
  ],
}
```

```js
// .eslintrc.js
module.exports = {
  plugins: [
    // ...
    'react',
  ],
  rules: {
    // ...
    'react/jsx-uses-react': 'error',
  },
  settings: {
    react: {
      pragma: 'h',
    },
  },
};
```
