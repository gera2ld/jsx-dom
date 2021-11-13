import { SVG_NS, NS_ATTRS, MOUNT_SINGLE, MOUNT_ARRAY } from './consts';
import { isLeaf, isElement, isNonEmptyArray, isRenderFunction } from './h';
import {
  VElementNode,
  VChildren,
  VFunctionNode,
  VProps,
  MountEnv,
  MountResult,
  DomNode,
  DomResult,
  VChild,
} from './types';

const DEFAULT_ENV: MountEnv = {
  isSvg: false,
};

export function insertDom(parent: HTMLElement | SVGElement, ref: MountResult) {
  if (ref.type === MOUNT_SINGLE) {
    if (ref.node != null) parent.append(ref.node);
  } else if (ref.type === MOUNT_ARRAY) {
    (ref.children as MountResult[]).forEach((ch) => {
      insertDom(parent, ch);
    });
  } else {
    throw new Error(`Unkown ref type ${JSON.stringify(ref)}`);
  }
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
      setDOMAttribute(domElement, key, props[key], env.isSvg);
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

export function mount(
  vnode: VChildren,
  env: MountEnv = DEFAULT_ENV
): MountResult {
  if (vnode == null || typeof vnode === 'boolean') {
    return {
      type: MOUNT_SINGLE,
      node: null,
    };
  }
  if (isRenderFunction(vnode)) {
    const { type, props } = vnode as VFunctionNode;
    const childVNode = type(props);
    return mount(childVNode, env);
  }
  if (isLeaf(vnode)) {
    return {
      type: MOUNT_SINGLE,
      node: document.createTextNode(`${vnode}`),
    };
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
    let childrenRef: MountResult;
    if (props.children) {
      let childEnv = env;
      if (env.isSvg && type === 'foreignObject') {
        childEnv = Object.assign({}, childEnv, { isSvg: false });
      }
      childrenRef = mount(props.children, childEnv);
    }
    if (childrenRef != null) insertDom(node, childrenRef);
    const { ref } = props;
    if (typeof ref === 'function') ref(node);
    return {
      type: MOUNT_SINGLE,
      node,
    };
  }
  if (isNonEmptyArray(vnode)) {
    return {
      type: MOUNT_ARRAY,
      children: (vnode as VChildren[]).map((child) => mount(child, env)),
    };
  }

  throw new Error('mount: Invalid Vnode!');
}

function flattenWithoutNull<T>(array: (T | T[])[]): T[] {
  let result = [];
  for (let i = 0; i < array.length; i += 1) {
    const item = array[i];
    if (Array.isArray(item)) result = result.concat(flattenWithoutNull(item));
    else if (item != null) result.push(item);
  }
  return result;
}

function asDom(result: MountResult): DomResult {
  if (result.type === MOUNT_SINGLE) {
    return result.node;
  }
  return result.children.map(asDom);
}

/**
 * Mount vdom as real DOM nodes.
 */
export function mountDom(vnode: VChild): DomNode;
export function mountDom(vnode: VChildren[]): DomNode[];
export function mountDom(vnode: VChildren) {
  if (Array.isArray(vnode)) {
    return flattenWithoutNull(vnode.map(mountDom));
  }
  return asDom(mount(vnode)) as DomNode;
}
