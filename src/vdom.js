import { hasProperty, toKebabCase, isObject, isFunction, isString } from './util.js'

export default class Dom {
  constructor() {
    return new Proxy({}, {
      get: this._getDom.bind(this)
    })
  }

  _getDom(target, tagName) {
    return (props = {}, ...childrens) => {
      childrens = childrens.map(item => {
        if (typeof(item) === 'string') {
          return {
            tagName: 'text',
            props: {},
            children: [item]
          }
        }
        return item
      })
      return {
        tagName,
        props,
        children: childrens
      }
    }
  }
}
