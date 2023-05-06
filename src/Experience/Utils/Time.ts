import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  start: number;
  elapsed: number;
  current: number;  //开始时间到现在的时间
  delta: number;    //上一帧到这一帧的时间
  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    // 如果这里直接调用this.tick()会出现 delta等于0的情况
    window.requestAnimationFrame(() => {
      this.tick();
    })
  }
  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;
    this.trigger("tick");
    window.requestAnimationFrame(() => {
      this.tick();
    })
  }
}