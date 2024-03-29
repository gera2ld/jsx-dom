export const VTYPE_ELEMENT = 1;
export const VTYPE_FUNCTION = 2;
export type VType = typeof VTYPE_ELEMENT | typeof VTYPE_FUNCTION;

export const SVG_NS = 'http://www.w3.org/2000/svg';

const XLINK_NS = 'http://www.w3.org/1999/xlink';
export const NS_ATTRS = {
  show: XLINK_NS,
  actuate: XLINK_NS,
  href: XLINK_NS,
};
