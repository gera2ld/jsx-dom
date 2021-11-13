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
import { mountDom } from '@gera2ld/jsx-dom';

// Create vdom
const vdom = <div>hello</div>;

// Mount as DOM element
const dom = mountDom(vdom);

// Attach to document
document.body.appendChild(dom);
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

You may also need [@babe/preset-react](https://babeljs.io/docs/en/babel-preset-react) or [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) to transform JSX with either automatic runtime or classic runtime. See below for Babel configuration for different runtimes, `tsconfig.json`/`jsconfig.json` is also recommended to provide better type definitions.

### Automatic runtime

When using automatic runtime with Babel, you don't need to import any extra helpers.

```js
// .babelrc
{
  // ...
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      { "runtime": "automatic", "importSource": "@gera2ld/jsx-dom" }
    ]
  ],
}
```

```js
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@gera2ld/jsx-dom",
  }
}
```

### Classic runtime

Another option is to use classic runtime. Note that you need `import JSX from '@gera2ld/jsx-dom'` whereever JSX is used.

```
// .babelrc
{
  // ...
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
        "runtime": "classic",
        "pragma": "JSX.h",
        "pragmaFrag": "JSX.Fragment"
      }
    ],
  ],
}
```

```js
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "JSX.h",
    "jsxFragmentFactory": "JSX.Fragment",
  }
}
```
