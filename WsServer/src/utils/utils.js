export const STATUS = {
  OPEN: '1',
  CLOSE: '0',
};

export const HeartTime = 3 * 1000;

export function getConfig(name) {
  return {
    connect: `WS_${name}_connect`,
    tab: `WS_${name}_tab`,
  };
}

export function isFunction(target) {
  return typeof target === 'function' && typeof target.nodeType !== 'number';
}

export function isString(target) {
  return typeof target === 'string';
}

export function isBoolean(target) {
  return typeof target === 'boolean';
}

/**
 * 事件监听
 * @param {Object} dom
 * @param {String} type
 * @param {Function} listener
 * @param {Object} options
 * @param {Boolean} useCapture
 * @returns
 */
export function addEventListener(
  dom,
  type,
  listener,
  options = false,
  useCapture = false,
) {
  if (!isFunction(listener)) {
    throw new Error(`${listener} is not Function`);
  }

  dom.addEventListener(type, listener, options, useCapture);
  return {
    remove() {
      dom.removeEventListener(type, listener, options, useCapture);
    },
  };
}
