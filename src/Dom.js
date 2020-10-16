import { SC_ATTR, SC_ATTR_ACTIVE, SC_ATTR_VERSION, SC_VERSION } from './constis';

const findLastStyleTag = (target) => {
  const { childNodes } = target;

  for (let i = childNodes.length; i >= 0; i--) {
    const child = childNodes[i]
    if (child && child.nodeType === 1 && child.hasAttribute(SC_ATTR)) {
      return child;
    }
  }

  return undefined;
};

export const makeStyleTag = (target) => {
  const head = document.head;
  const parent = target || head;
  const style = document.createElement('style');
  const prevStyle = findLastStyleTag(parent);
  const nextSibling = prevStyle !== undefined ? prevStyle.nextSibling : null;

  style.setAttribute(SC_ATTR, SC_ATTR_ACTIVE);
  style.setAttribute(SC_ATTR_VERSION, SC_VERSION);

  parent.insertBefore(style, nextSibling);

  return style;
};