import {
  VType,
  VTYPE_ELEMENT,
  VTYPE_FUNCTION,
  MOUNT_SINGLE,
  MOUNT_ARRAY,
} from './consts';

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

export type VChild = string | number | boolean | null | Node | VNode;
export type VChildren = VChild | VChildren[];

export interface MountEnv {
  isSvg: boolean;
}

export type DomNode = Node;
export type DomResult = DomNode | DomResult[];

export interface MountSingleResult {
  type: typeof MOUNT_SINGLE;
  node: DomNode | null;
}

export interface MountArrayResult {
  type: typeof MOUNT_ARRAY;
  children: MountResult[];
}

export type MountResult = MountSingleResult | MountArrayResult;
