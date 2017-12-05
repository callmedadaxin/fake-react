import { hasProperty, toKebabCase, isObject, isFunction, isString } from './util.js'

export default class Dom {
  constructor() {
    return new Proxy({}, {
      get: this._getDom.bind(this)
    })
  }

  _getDom(target, tagName) {
    return (props = {}, ...childrens) => {
      return {
        tagName,
        props,
        children: childrens
      }
    }
  }
}
