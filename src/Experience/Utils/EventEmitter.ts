

export default class EventEmitter {
  eventBus: {
    [index: string]: any[] | null,
  }

  constructor() {
    this.eventBus = {}
  }


  on(eventName: string, eventCb: (e?: any) => void, thisArg?: unknown) {
    if (typeof eventName !== 'string') {
      throw new Error('eventName must be string ')
    }
    if (typeof eventCb !== 'function') {
      throw new Error('event CallBack  must be a function ')
    }
    let handlers = this.eventBus[eventName];  //handlers 数组里面是一个个对象。对象里面是回调和执行回调的this
    if (!handlers) { //如果是第一次注册该事件
      handlers = [];
      this.eventBus[eventName] = handlers;
    }
    handlers.push({
      eventCb, thisArg
    })
    return this
  }

  trigger(eventName: string, ...args) {
    const handlers = this.eventBus[eventName]
    if (!handlers) throw new Error(`cannot find the ${eventName} event callback`)
    handlers.forEach(handler => {
      handler.eventCb.apply(handler.thisArg, args)
    });
    return this
  }

  off(eventName: string, eventCb: () => void) {

    const handlers = this.eventBus[eventName]
    if (!handlers) return
    const newHandlers = [...handlers]
    for (let i = 0; i < newHandlers.length; i++) {
      const handler = newHandlers[i]
      if (handler.eventCb === eventCb) {
        const index = handlers.indexOf(handler)
        handlers.splice(index, 1)
      }
    }
    //如果没有回调了，要把这个属性删除
    if (handlers.length === 0) {
      delete this.eventBus[eventName]
    }
  }


  once(eventName: string, eventCb: () => void, thisArg) {

    const tempCallBack = (...args) => {

      this.off(eventName, tempCallBack)
      eventCb.apply(thisArg, args)

    }
    return this.on(eventName, tempCallBack, thisArg)
  }

  clear(eventName: string) {
    this.eventBus[eventName] = null
  }

}
