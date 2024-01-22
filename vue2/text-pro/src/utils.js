/**
 * 将样式转字符串
 * @param {CSSStyleDeclaration} style
 * @returns
 */
function styleToString(style) {
  // There are some different behavior between Firefox & Chrome.
  // We have to handle this ourself.
  const styleNames = Array.prototype.slice.apply(style);
  return styleNames
    .map((name) => `${name}: ${style.getPropertyValue(name)};`)
    .join('');
}

/**
 * 重置样式
 * @param {HTMLElement} target
 * @param {HTMLElement} origin
 */
function resetDomStyles(target, origin) {
  try {
    target.setAttribute('aria-hidden', 'true');
    const originStyle = window.getComputedStyle(origin);
    const originCSS = styleToString(originStyle);
    // Set shadow
    target.setAttribute('style', originCSS);
    target.style.position = 'fixed';
    target.style.left = '0';
    target.style.height = 'auto';
    target.style.minHeight = 'auto';
    target.style.maxHeight = 'auto';
    target.style.paddingTop = '0';
    target.style.paddingBottom = '0';
    target.style.borderTopWidth = '0';
    target.style.borderBottomWidth = '0';
    target.style.top = '-999999px';
    target.style.zIndex = '-1000';
    // clean up css overflow
    target.style.textOverflow = 'clip';
    target.style.whiteSpace = 'normal';
    target.style.webkitLineClamp = 'none';
  } catch (error) {
    console.error(error);
    console.log(origin);
  }
}

/**
 * 获取“未换行情况”下的行高
 * @param {HTMLElement} dom
 * @returns
 */
export function getLineHeight(dom) {
  const text = document.createElement('div');
  text.appendChild(document.createTextNode('text'));
  resetDomStyles(text, dom);
  document.body.appendChild(text);
  const height = text.getBoundingClientRect().height;
  document.body.removeChild(text);
  return height;
}
