export default class BaseComponent {
  setState(newState) {
    this.state = Object.assign({}, this.state, newState)
    const result = this.render()

    if (this.isRoot) {
      this.update && this.update(result)
    }
  }
}