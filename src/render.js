export default function (App, targetName) {
  const target = document.querySelector(targetName)
  const app = new App()
  let old = app.render()
  app.isRoot = true
  app.update = (newDom) => {
    target.innerHTML = ''
    target.appendChild(newDom)
  }
  target.appendChild(old)
}