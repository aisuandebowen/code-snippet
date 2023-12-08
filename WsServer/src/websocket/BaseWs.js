import { Event } from '../config';
import { isString, isFunction, isBoolean } from '../utils/utils';

export default class BaseWs {
  /**
   * 构造方法
   * @param {String} url ws链接
   * @param {Object} options 选项
   * @param {Function} options.open
   * @param {Function} options.message
   * @param {Function} options.beforeClose 关闭连接前
   * @param {Function} options.close
   * @param {Function} options.closed 关闭连接后
   * @param {Function} options.error
   * @param {Function} options.beforeSend 发送数据前
   * @param {Function} options.send
   * @param {Function} options.sended 发送数据后
   */
  constructor(url, options) {
    this.ws = null;
    this.options = options;
    this.init(url, options);
  }

  close() {
    const flag = this.checkBeforeMethod('beforeClose', undefined, true);
    if (flag) {
      this.ws.close();
      this.options?.closed?.();
    }
  }

  send(data) {
    const strData = isString(data) ? data : JSON.stringify(data);
    // 返回值为布尔采用其值，反之默认允许send
    const flag = this.checkBeforeMethod('beforeSend', data, true);
    if (flag) {
      this.ws.send(strData);
      this.options?.sended?.(strData);
    }
  }

  init(url, options) {
    this.ws = new WebSocket(url);
    this.listEvent(options);
  }

  listEvent(options) {
    const events = Object.values(Event);
    for (const eventName of events) {
      this.ws.addEventListener(eventName, (e) => {
        options?.[eventName]?.(e); // 执行回调
      });
    }
  }

  checkBeforeMethod(name, data, defaultRes = true) {
    const method = this.options?.[name];
    if (isFunction(method)) {
      const res = method(data);
      return isBoolean(res) ? res : defaultRes;
    }
    return defaultRes;
  }

  isCreatedWS() {}
}
