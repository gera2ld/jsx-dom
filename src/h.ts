import { VType, VTYPE_ELEMENT, VTYPE_FUNCTION } from './consts';
import { VProps, VFunction, VChildren, VNode } from './types';

export const EMPTY_OBJECT = {};

export const isNonEmptyArray = (c: VChildren) =>
  Array.isArray(c) && c.length > 0;
export const isLeaf = (c: VChildren) =>
  typeof c === 'string' || typeof c === 'number';
export const isElement = (c: VChildren) =>
  (c as VNode)?.vtype === VTYPE_ELEMENT;
export const isRenderFunction = (c: VChildren) =>
  (c as VNode)?.vtype === VTYPE_FUNCTION;

export function h(
  type: string | VFunction,
  props: VProps,
  ...children: VChildren[]
) {
  props = Object.assign({}, props, {
    children: children.length === 1 ? children[0] : children,
  });

  return jsx(type, props);
}

export function jsx(type: string | VFunction, props: VProps): VNode {
  let vtype: VType;
  if (typeof type === 'string') vtype = VTYPE_ELEMENT;
  else if (typeof type === 'function') vtype = VTYPE_FUNCTION;
  else throw new Error('Invalid VNode type');
  return {
    vtype,
    type,
    props,
  };
}

export const jsxs = jsx;

export function Fragment(props: VProps) {
  return props.children;
}
