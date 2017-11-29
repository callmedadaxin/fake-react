export default class BaseComponent {
  setState(newState) {
    this.state = newState
    this.render()
  }
}