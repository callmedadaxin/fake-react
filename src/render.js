export default function (App, targetName) {
  const target = document.querySelector(targetName)
  const app = new App()
  let old = app.render()
  app.isRoot = true
  app.update = (newDom) => {
    target.insertBefore(newDom, old)
    target.removeChild(old)
    old = newDom
  }
  target.appendChild(old)
}