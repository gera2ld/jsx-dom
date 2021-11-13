import { VType, MountType, VTYPE_ELEMENT, VTYPE_FUNCTION } from './consts';

export interface VProps {
  [key: string]: any;
  children: VChildren;
}

export type VFunction = (props: VProps) => VNode;

export interface VNode {
  vtype: VType;
  type: string | VFunction;
  props: VProps;
}

export interface VElementNode extends VNode {
  vtype: typeof VTYPE_ELEMENT;
  type: string;
}

export interface VFunctionNode extends VNode {
  vtype: typeof VTYPE_FUNCTION;
  type: VFunction;
}

export type VChild = string | number | VNode;
export type VChildren = VChild | VChildren[];

export interface MountEnv {
  isSvg: boolean;
}

export interface MountResult {
  type: MountType;
  node?: HTMLElement | SVGElement | Text;
  children?: MountResult | MountResult[];
}
