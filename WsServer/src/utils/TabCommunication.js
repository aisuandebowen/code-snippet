import { addEventListener } from './utils';

function sendMes(key, value) {
  const _value = JSON.stringify(value);
  window.localStorage.setItem(key, _value);
  window.localStorage.removeItem(key);
}

/**
 * 页签通信工具
 */
export default class TabCommunication {
  /**
   * 给指定key发送消息
   * @param {String} key 指定loccalStorage
   * @param {*} value 值
   */
  static sendMes(key, value) {
    if (key) {
      sendMes(key, value);
    }
  }

  /**
   * 构造函数
   * @param {Object} options
   * @param {Function} options.handleMsgFn 处理消息的方法
   * @param {String} options.name 页签名(localStorage同名)
   */
  constructor({ handleMsgFn, name }) {
    this.handleMsgFn = handleMsgFn;
    this.name = name;
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    this.listener = addEventListener(window, 'storage', (data) => {
      const value = data.newValue;
      const key = data.key;
      if (value && this.handleMsgFn && key === this.name) {
        // 发送数据
        this.handleMsgFn({
          key,
          value: JSON.parse(value),
        });
      }
    });
  }

  /**
   * 仅给name发消息
   * @param {Object} value - data
   */
  sendMes(value) {
    sendMes(this.name, value);
  }

  /**
   * 停止监听
   */
  clear() {
    this.listener.remove();
  }
}
