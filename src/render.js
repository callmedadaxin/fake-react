import Dom from './dom'
import { compareObject, foreach, isText, isFunction } from './util'
import { updater } from './updater'
const dom = new Dom()

/**
 * 渲染真正的dom树
 * @param {*} vdom 
 */
function rendom(vdom) {
  const { tagName, props, children = [] } = vdom
  if (!tagName) {
    return vdom
  }
  return dom[tagName](props, ...children.map(item => {
    return rendom(item)
  }))
}

const PROPS = Symbol('PROPS')
const TEXT = Symbol('TEXT')
const isTextNode = obj => obj.tagName === 'text'
/**
 * 比较两虚拟dom的差异
 * 差异类型 REPLACE, MODIFIED, PROPS, TEXT
 */
function diff(oldVDom, newVDom, patches = [], index = 0) {
  patches[index] = patches[index] || []
  if (isText(oldVDom)) {
    if (isText(newVDom)) {
      if (oldVDom !== newVDom) {
        patches[index].push({
          type: TEXT,
          text: newVDom
        })
        return
      }
    }
    return
  }

  // 处理props差异
  const propsSame = compareObject(oldVDom.props, newVDom.props)
  if (!propsSame.isSame) {
    patches[index].push({
      type: PROPS,
      props: propsSame.patches
    })
  }
  if (oldVDom.tagName !== 'text') {
    diffChildren(oldVDom.children, newVDom.children, patches, index)
  } else {
    diff(oldVDom.children[0], newVDom.children[0], patches, ++index)
  }
  return patches
}

function diffChildren(oldChildren, newChildren, patches, index) {
  if (oldChildren && oldChildren.length) {
    oldChildren.forEach((children, i) => {
      diff(children, newChildren[i], patches, ++index)
    })
  }
}

/**
 * 将修改应用在真实的dom上
 */
function patch(node, patcheList, count = {index: 0}) {
  const patches = patcheList[count.index]
  if (patches) {
    patches.forEach(patch => {
      switch (patch.type) {
        case PROPS:
          foreach(patch.props, (content, key) => {
            if (isFunction(content)) {
              return true
            }
            updater.attr(node, key, content)
          })
          break
        case TEXT:
          node.textContent = patch.text
          break
        default:
          break
      }
    });
  }
  if (node.hasChildNodes() && node.childNodes.length) {
    patchChildren(Array.from(node.childNodes), patcheList, count)
  }
}

function patchChildren(nodeList, patcheList, count) {
  nodeList.forEach((node, i) => {
    count.index++
    patch(node, patcheList, count)
  })
}

export default function (App, targetName) {
  const target = document.querySelector(targetName)
  const app = new App()
  let old = app.render()
  let oldDom = rendom(old)
  
  app.isRoot = true
  app.update = (newConfig) => {
    // 计算差异
    const patches = diff(old, newConfig)
    patch(oldDom, patches)
  }
  target.appendChild(oldDom)
}