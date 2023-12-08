import { getConfig } from '../utils/utils';

export default class WsConfig {
  constructor(name, url, options) {
    this.name = name;
    this.url = url;
    this.options = options;
    this.config = getConfig(name);
  }

  close() {}
}
