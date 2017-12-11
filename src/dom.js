import { hasProperty, toKebabCase, isObject, isFunction, isString } from './util.js'

export default class Dom {
  constructor () {
    return new Proxy({}, {
      get: this._getDom.bind(this)
    })
  }

  _getDom (target, tagName) {
    return (attrs = {}, ...childrens) => {
      if (tagName === 'text') {
        return document.createTextNode(childrens)
      }
      this._elem = document.createElement(tagName)
      this._attrs = attrs
      this._childrens = childrens
      this._bindAttrs()
      this._addChildrens()

      return this._elem
    }
  }

  /**
   * 属性
   * @return {[type]} [description]
   */
  _bindAttrs () {
    const { _attrs, _elem, _vm } = this

    for (let attr in _attrs) {
      if (hasProperty(_attrs, attr)) {
        // // 事件绑定
        // if (attr.indexOf('@') === 0) {
        //   this._bindEvents(attr)
        // } else if (attr.indexOf('$') === 0) {
        //   this._bindDirectives(attr, _elem)
        // } else if (attr.indexOf(':') === 0) {
        //   compileUtil.attr(_elem, _vm, _attrs[attr], attr.slice(1))
        // } else {
        if(attr.indexOf('on') === 0) {
          _elem[attr] = _attrs[attr]
        } else {
          _elem.setAttribute(attr, _attrs[attr])
        }
        // }
      }
    }
  }

  /**
   * 事件绑定
   * @return {[type]} [description]
   */
  _bindEvents (attr) {
    // TODO event decorator
    this._elem.addEventListener(attr.substr(1), this._attrs[attr], false)
  }

  /**
   * 渲染子节点
   */
  _addChildrens () {
    const { _childrens, _elem, _vm } = this
    _childrens.forEach(children => {
      const type = typeof children
      let child
      switch (type) {
        case 'string':
          child = document.createTextNode(children)
          break
        default:
          child = children
      }
      _elem.appendChild(child)
    })
  }
}
