
import { isNull, toKebabCase } from './util'
export const updater = {
  text (node, value) {
    node.textContent = value
  },
  attr (node, key, value) {
    // 处理style等特殊模式
    if (updater[key]) {
      return updater[key](node, value)
    }

    if (isNull(value)) {
      return node.removeAttribute(key)
    }
    return node.setAttribute(key, value)
  },
  /**
   * {
   *   color: '#fff',
   *   fontSize: '12px'
   * }
   */
  style (node, value) {
    const ret = Object.keys(value).map(key => {
      return `${toKebabCase(key)}: ${value[key]};`
    }).join('')
    node.setAttribute('style', ret)
  }
}