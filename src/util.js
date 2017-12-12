export const isNull = obj => !obj && obj !== 0
export const hasProperty = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export const isObject = obj => {
  return Object.prototype.toString.call(obj) === "[object Object]"
}

export const isText = obj => typeof obj === 'string'

export const isFunction = obj => {
  return typeof obj === 'function'
}

export const isString = obj => {
  return typeof obj === 'string'
}

export const toCamelCase = str => {
  return str.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase)
}

export const toKebabCase = str => {
  return str.replace(/[A-Z]/g, (letter) => `-${letter}`).toLowerCase()
}

export const foreach = (obj, fn) => {
  const keys = Object.keys(obj)
  let ret

  if (!keys.length) {
    return
  }

  for (let key of keys) {
    ret = fn.call(obj, obj[key], key)

    // 当返回false时，终止循环
    if (ret === false) {
      break
    }
  }
}

export const compareArray = (arr, newArray) => {
  if (arr.length !== newArray.length) {
    return false
  }
  return arr.every((item, index) => item === newArray[index])
}

export const compareObject = (obj, newObj) => {
  const ret = {
    isSame: true,
    patches: {}
  }
  foreach(obj, (item, key) => {
    const newObjItem = newObj[key]
    if (isObject(item)) {
      const r = compareObject(item, newObjItem)
      if (!r.isSame) {
        ret.isSame = false
        ret.patches[key] = newObjItem
        return
      }
    }

    if (Array.isArray(item)) {
      const same = compareArray(item, newObjItem)
      if (!same) {
        ret.isSame = false
        ret.patches[key] = newObjItem
        return
      }
    }

    if (item !== newObjItem) {
      ret.isSame = false
      ret.patches[key] = newObjItem
      return
    }
  })
  return ret
}
