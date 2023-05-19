import { REACT_ELEMENT, REACT_TEXT } from "../shared/constants";
export const FunctionComponent = 0;
export const ClassComponent = 1;
export const HostRoot = 3;
export const HostComponent = 5;
export const HostText = 6;

export function getTag(element) {
  if (element.$$typeof === REACT_ELEMENT) {
    if (typeof element.type === "string") {
      return HostComponent;
    }
    if (typeof element.type === "function") {
      if (element.type.isReactComponent) {
        return ClassComponent;
      }
      return FunctionComponent;
    }
  }

  if (element.$$typeof === REACT_TEXT) {
    return HostText;
  }
}
