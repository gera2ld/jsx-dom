const propNames = [
  'innerHTML',
  'innerText',
  'textContent',
];

export default function createElement(tag, props, ...children) {
  const el = document.createElement(tag);
  let ref;
  if (props) {
    Object.keys(props).forEach(key => {
      const value = props[key];
      if (value == null) return;
      if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'children') {
        renderChild(el, value);
      } else if (key === 'style' && typeof value === 'object') {
        renderStyle(el, value);
      } else if (key === 'dangerouslySetInnerHTML' && value) {
        el.innerHTML = value.__html || ''; // eslint-disable-line no-underscore-dangle
      } else if (key === 'ref' && typeof value === 'function') {
        ref = value;
      } else if (typeof value === 'boolean') {
        if (value) el.setAttribute(key, key);
        else el.removeAttribute(key);
      } else if (propNames.indexOf(key) >= 0) {
        el[key] = value;
      } else {
        if (key === 'className') key = 'class';
        else if (key === 'labelFor') key = 'for';
        el.setAttribute(key, `${value}`);
      }
    });
  }
  renderChild(el, children);
  if (ref) ref(el);
  return el;
}

function renderChild(el, child) {
  if (Array.isArray(child)) {
    child.forEach(ch => renderChild(el, ch));
    return;
  }
  if (child == null || child === false) return;
  if (typeof child !== 'object') {
    el.appendChild(document.createTextNode(`${child}`));
  } else {
    el.appendChild(child);
  }
}

function renderStyle(el, style) {
  Object.keys(style).forEach(key => {
    const value = style[key];
    if (typeof value === 'number') el.style[key] = `${value}px`;
    else el.style[key] = value;
  });
}
