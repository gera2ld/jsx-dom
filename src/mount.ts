import { SVG_NS, NS_ATTRS } from './consts';
import { isLeaf, isElement, isRenderFunction, h, Fragment } from './h';
import {
  VElementNode,
  VChild,
  VChildren,
  VFunctionNode,
  VProps,
  MountEnv,
} from './types';

const DEFAULT_ENV: MountEnv = {
  isSvg: false,
};

export function insertDom(
  parent: HTMLElement | SVGElement | DocumentFragment,
  nodes: Node | Node[]
) {
  if (!Array.isArray(nodes)) nodes = [nodes];
  nodes = nodes.filter(Boolean);
  if (nodes.length) parent.append(...nodes);
}

export function mountAttributes(
  domElement: HTMLElement | SVGElement,
  props: VProps,
  env: MountEnv
) {
  for (const key in props) {
    if (key === 'key' || key === 'children' || key === 'ref') continue;
    if (key === 'dangerouslySetInnerHTML') {
      domElement.innerHTML = props[key].__html;
    } else if (
      key === 'innerHTML' ||
      key === 'textContent' ||
      key === 'innerText'
    ) {
      domElement[key] = props[key];
    } else if (key.startsWith('on')) {
      domElement[key.toLowerCase()] = props[key];
    } else {
      setDOMAttribute(
        domElement,
        key,
        props[key] as string | boolean,
        env.isSvg
      );
    }
  }
}

const attrMap = {
  className: 'class',
  labelFor: 'for',
};

function setDOMAttribute(
  el: HTMLElement | SVGElement,
  attr: string,
  value: boolean | string,
  isSVG: boolean
) {
  attr = attrMap[attr] || attr;
  if (value === true) {
    el.setAttribute(attr, '');
  } else if (value === false) {
    el.removeAttribute(attr);
  } else {
    const namespace = isSVG ? NS_ATTRS[attr] : undefined;
    if (namespace !== undefined) {
      el.setAttributeNS(namespace, attr, value);
    } else {
      el.setAttribute(attr, value);
    }
  }
}

function flatten<T>(arr: Array<T | T[]>): T[] {
  return arr.reduce((prev: T[], item) => prev.concat(item), []) as T[];
}

function mountChildren(children: VChildren, env: MountEnv): Node | Node[] {
  return Array.isArray(children)
    ? flatten(children.map((child) => mountChildren(child, env)))
    : mount(children, env);
}

export function mount(vnode: VChild, env: MountEnv = DEFAULT_ENV): Node {
  if (vnode == null || typeof vnode === 'boolean') {
    return null;
  }
  if (vnode instanceof Node) {
    return vnode;
  }
  if (isRenderFunction(vnode)) {
    const { type, props } = vnode as VFunctionNode;
    if (type === Fragment) {
      const node = document.createDocumentFragment();
      if (props.children) {
        const children = mountChildren(props.children, env);
        insertDom(node, children);
      }
      return node;
    }
    const childVNode = type(props);
    return mount(childVNode, env);
  }
  if (isLeaf(vnode)) {
    return document.createTextNode(`${vnode}`);
  }
  if (isElement(vnode)) {
    let node: HTMLElement | SVGElement;
    const { type, props } = vnode as VElementNode;
    if (!env.isSvg && type === 'svg') {
      env = Object.assign({}, env, { isSvg: true });
    }
    if (!env.isSvg) {
      node = document.createElement(type);
    } else {
      node = document.createElementNS(SVG_NS, type);
    }
    mountAttributes(node, props, env);
    if (props.children) {
      let childEnv = env;
      if (env.isSvg && type === 'foreignObject') {
        childEnv = Object.assign({}, childEnv, { isSvg: false });
      }
      const children = mountChildren(props.children, childEnv);
      if (children != null) insertDom(node, children);
    }
    const { ref } = props;
    if (typeof ref === 'function') ref(node);
    return node;
  }

  throw new Error('mount: Invalid Vnode!');
}

/**
 * Mount vdom as real DOM nodes.
 */
export function mountDom(vnode: VChild) {
  return mount(vnode);
}

/**
 * Render and mount without returning VirtualDOM, useful when you don't need SVG support.
 */
export function hm(...args: Parameters<typeof h>) {
  return mountDom(h(...args));
}
