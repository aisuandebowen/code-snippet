import WsConfig from './WsConfig';
import TabCommunication from '../utils/TabCommunication';

export default class MoreTabWs extends WsConfig {
  constructor(name, url, options) {
    super(name, url, options);
    this.tabMonitor = null;
    this.init();
  }

  init() {
    this.tabMonitor = new TabCommunication({
      name: this.config.tab,
      handleMsgFn: this.handleMsgFn.bind(this),
    });
  }

  handleMsgFn({ value }) {
    const { name, data } = value;
    this.options[name](data);
  }

  clear() {
    this.tabMonitor.clear();
  }
}
