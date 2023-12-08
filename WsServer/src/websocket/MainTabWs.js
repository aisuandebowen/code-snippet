import WsConfig from './WsConfig';
import BaseWs from './BaseWs';
import TabCommunication from '../utils/TabCommunication';
import WsHeart from './WsHeart';
import { HeartTime, Event } from '../config';

export default class MainTabWs extends WsConfig {
  constructor(name, url, options) {
    super(name, url, options);
    this.sendTabFn = [Event.CLOSE, Event.ERROR, Event.MESSAGE]; // 需要发送到其他Tab的方法
    this.reconnectNum = null; // 重连次数
    this.MAX_CONNECT_NUM = 10; // 最大重连次数
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    this.reconnectNum = 0; // 重连次数
    // 添加执行前的回调方法
    this.addPreFn();
    this.initWS();
  }

  /**
   * 初始化建立websocket
   */
  initWS() {
    this.clearWS();
    // 创建ws
    this.ws = new BaseWs(this.url, this.addBusinessOptions);
  }

  /**
   * 清除WS
   */
  clearWS() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 接收到消息后，发送到其他tab
   */
  addPreFn() {
    for (const fnName of this.sendTabFn) {
      const fn = this.options?.[fnName];
      if (fn) {
        this.options[fnName] = (data) => {
          this.sendTab(fnName, data.data); // 发送消息
          fn(data);
        };
      }
    }
    // 添加业务方法
    this.addBusinessOptions = {
      ...this.options,
      [Event.OPEN]: this.onOpen.bind(this),
      [Event.CLOSE]: this.onClose.bind(this),
      [Event.ERROR]: this.onError.bind(this),
    };
  }

  /**
   * 发送一次消息到tab
   * @param {*} data
   */
  sendTab(name, data) {
    TabCommunication.sendMes(this.config.tab, {
      name,
      data,
    });
  }

  onOpen() {
    this.reconnectNum = 0; // 重连次数
    // 开始心跳
    this.startHeart();
    this.options[Event.OPEN]();
  }

  onClose() {
    this.clearHeart();
    this.options[Event.CLOSE]();
  }

  onError() {
    if (this.reconnectNum < this.MAX_CONNECT_NUM) {
      // 待优化
      setTimeout(() => {
        this.reconnectNum++;
        this.initWS();
      }, 5000);
    }
  }

  /**
   * 开始心跳
   */
  startHeart() {
    if (this.heart) {
      this.clearHeart();
    }
    this.heart = new WsHeart(HeartTime, () => {
      const closeSendStatus = [2, 3];
      if (closeSendStatus.includes(this.ws.readyState)) {
        // ws即将关闭，停止发送心跳
        this.clearHeart();
      } else {
        // 心跳
        this.ws.send('ping');
      }
    });
  }

  /**
   * 停止心跳
   */
  clearHeart() {
    this.heart.clearHeart();
    this.heart = null;
  }

  /**
   * 关闭所有活动
   */
  close() {
    this.clearHeart();
    this.clearWS();
  }
}
