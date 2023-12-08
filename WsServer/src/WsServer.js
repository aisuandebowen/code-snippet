import { STATUS } from './config';
import WsConfig from './websocket/WsConfig';
import MainTabWs from './websocket/MainTabWs';
import MoreTabWs from './websocket/MoreTabWs';
import TabCommunication from './utils/TabCommunication';

/**
 * 获取连接状态
 * @param {String} name
 * @returns
 */
function getConnectStatus(name) {
  const locStatus = localStorage.getItem(name);
  return locStatus === STATUS.OPEN;
}

/**
 * 多标签页WebSocket服务
 */
export default class WsServer extends WsConfig {
  constructor(name, url, options) {
    super(name, url, options);
    this.ws = null;
    this.isMainTab = false;
    this.init();
  }

  init() {
    const tabName = this.config.connect;
    if (getConnectStatus(tabName)) {
      // 属于其他标签页
      this.createOtherTabWS();
      // close事件 -> 广播 -> moreTab 建立ws -> 谁先建立谁先设立local -> 后续慢一点的读取local停止创建
    } else {
      // 主标签页（即建立了ws的标签页）
      this.createMainTabWS(tabName);
    }
    // 开始监听事件
    this.listenEvent();
  }

  /**
   * 创建主标签页WS
   * @param {String} tabName 标签页名
   */
  createMainTabWS(tabName) {
    this.isMainTab = true;
    localStorage.setItem(tabName, STATUS.OPEN);
    this.ws = new MainTabWs(this.name, this.url, this.options);
  }

  /**
   * 创建其他标签页，监听主标签页的消息
   */
  createOtherTabWS() {
    this.ws = new MoreTabWs(this.name, this.url, this.options);
  }

  /**
   * 开始监听事件
   */
  listenEvent() {
    this.listenConnectStatus();
    this.listenBeforeunload();
  }

  // 当浏览器窗口关闭或者刷新时
  listenBeforeunload() {
    window.addEventListener('beforeunload', (event) => {
      if (this.isMainTab) {
        this.ws.close();
        this.connectStatus && this.connectStatus.sendMes(STATUS.CLOSE); // 通知所有标签页，当前无WS建立
      }
    });
  }

  /**
   * 监听标签WS连接状态
   */
  listenConnectStatus() {
    const tabName = this.config.connect;
    this.connectStatus = new TabCommunication({
      name: tabName,
      handleMsgFn: this.handleMsgFn.bind(this),
    });
  }

  /**
   * 处理连接状态
   */
  handleMsgFn(data) {
    const { value } = data;
    console.log(`log-begin：${Date.now()}`);
    console.log('result：', data, value);
    console.log(`log-end：${Date.now()}`);
    switch (value) {
      case STATUS.CLOSE:
        // 如果为CLOSE -> 证明当前没有建立ws的 -> 开始创建WS
        if (!this.isMainTab) {
          // 通知其他页面
          this.connectStatus.sendMes(STATUS.OPEN);
          setTimeout(() => {
            this.ws.clear();
            this.init();
          }, 1000);
        }
        break;
      case STATUS.OPEN:
        // 如果为true -> 证明当前已有建立的了 -> 删除正在创建/已创建的WS
        break;
      default:
        break;
    }
  }
}
