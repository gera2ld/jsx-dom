# @gera2ld/jsx-dom

[![NPM](https://img.shields.io/npm/v/@gera2ld/jsx-dom.svg)](https://npm.im/@gera2ld/jsx-dom)
![License](https://img.shields.io/npm/l/@gera2ld/jsx-dom.svg)
![Downloads](https://img.shields.io/npm/dt/@gera2ld/jsx-dom.svg)

Use JSX for HTML/SVG elements.

## Usage

```sh
$ yarn add @gera2ld/jsx-dom
# ESLint
$ yarn add eslint-plugin-react -D
```

```js
import { mount } from '@gera2ld/jsx-dom';

const vdom = <div>hello</div>;
document.body.appendChild(mount(vdom));
```

```js
// .babelrc
{
  // ...
  "presets": [
    [
      "@babel/preset-react",
      { "runtime": "automatic", "importSource": "@gera2ld/jsx-dom" }
    ]
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
};
```
