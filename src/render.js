import Dom from './dom'
import { compareObject, foreach } from './util'
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
/**
 * 比较两虚拟dom的差异
 * 差异类型 REPLACE, MODIFIED, PROPS, TEXT
 */
function diff(oldVDom, newVDom, patches = [], index = 0) {
  patches[index] = []
  const propsSame = compareObject(oldVDom.props, newVDom.props)
  if (!propsSame.isSame) {
    patches[index].push({
      type: PROPS,
      props: propsSame.patches
    })
  }
  return patches
}

/**
 * 将修改应用在真实的dom上
 */
function patch(node, patcheList, index = 0) {
  const patches = patcheList[index]
  console.log(patcheList)
  if (patches) {
    patches.forEach(patch => {
      switch (patch.type) {
        case PROPS:
          foreach(patch.props, (content, key) => {
            if (!content) {
              node.removeAttribute(key)
            } else {
              node.setAttribute(key, content)
            }
          })
          break;

        default:
          break;
      }
    });
  }
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