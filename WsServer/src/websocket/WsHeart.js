export default class WsHeart {
  constructor(time, callback) {
    this.heart = null;
    this.init(time, callback);
  }

  init(time, callback) {
    this.createHeart(time, callback);
  }

  createHeart(time, callback) {
    this.clearHeart();
    this.heart = setInterval(() => {
      callback();
    }, time);
  }

  clearHeart() {
    clearInterval(this.heart);
    this.heart = null;
  }
}
