import Dom from './dom'
const dom = new Dom()

function rendom(vdom) {
  const { tagName, props, children = [] } = vdom

  if (!tagName) {
    return vdom
  }

  return dom[tagName](props, ...children.map(item => {
    return rendom(item)
  }))
}

export default function (App, targetName) {
  const target = document.querySelector(targetName)
  const app = new App()
  let old = app.render()
  let oldDom = rendom(old)
  
  app.isRoot = true
  app.update = (newConfig) => {
    const newDom = rendom(newConfig)
    target.insertBefore(newDom, oldDom)
    target.removeChild(oldDom)
    oldDom = newDom
  }
  target.appendChild(oldDom)
}