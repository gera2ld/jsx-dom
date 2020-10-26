const propRules = [
  'innerHTML',
  'innerText',
  'textContent',
  { key: 'value', tag: 'textarea' },
];

type JSXComponent = (props: JSXProps) => JSXElement;

export const Fragment: JSXComponent = () => document.createDocumentFragment();

export type JSXProps = {
  [key: string]: any;
};

export type JSXElement = HTMLElement | DocumentFragment;
export type JSXSingleChild = string | boolean | JSXElement;
export type JSXChild = JSXSingleChild | JSXSingleChild[];

export function createElement(
  tag: string | JSXComponent,
  props?: JSXProps,
  ...children: JSXChild[]
): JSXElement {
  let result: JSXElement;
  let ref: (el: JSXElement) => void;
  if (typeof tag === 'function') {
    result = tag(props || {});
  } else if (typeof tag !== 'string') {
    throw new Error(`Invalid element type: ${tag}`);
  } else {
    const el = createElement.createElement(tag);
    result = el;
    if (props) {
      Object.keys(props).forEach((key) => {
        const value = props[key];
        if (value == null) return;
        if (key.startsWith('on')) {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === 'children') {
          renderChildren(el, value);
        } else if (key === 'style' && typeof value === 'object') {
          renderStyle(el, value);
        } else if (key === 'dangerouslySetInnerHTML' && value) {
          el.innerHTML = value.__html || ''; // eslint-disable-line no-underscore-dangle
        } else if (key === 'ref' && typeof value === 'function') {
          ref = value;
        } else if (typeof value === 'boolean') {
          if (value) el.setAttribute(key, key);
          else el.removeAttribute(key);
        } else if (isProp(tag, key)) {
          el[key] = value;
        } else {
          if (key === 'className') key = 'class';
          else if (key === 'labelFor') key = 'for';
          el.setAttribute(key, `${value}`);
        }
      });
    }
  }
  renderChildren(result, children);
  if (ref) ref(result);
  return result;
}

createElement.createElement = (tag: string): HTMLElement => document.createElement(tag);

function isProp(tag: string, key: string): boolean {
  const ctx = {
    tag,
    key,
  };
  return propRules.some((rule) => {
    if (typeof rule === 'string') return key === rule;
    return Object.keys(rule).every((rk) => rule[rk] === ctx[rk]);
  });
}

function renderChildren(el: JSXElement, children: JSXChild[]): void {
  children.forEach((child) => {
    if (child == null || child === false) return;
    if (Array.isArray(child)) {
      renderChildren(el, child);
      return;
    }
    if (typeof child !== 'object') {
      el.appendChild(document.createTextNode(`${child}`));
    } else {
      el.appendChild(child);
    }
  });
}

function renderStyle(el: HTMLElement, style: { [key: string]: number | string }): void {
  Object.keys(style).forEach((key) => {
    const value = style[key];
    el.style[key] = value;
  });
}
