import Component from './base'
import Dom from './dom'

const dom = new Dom()

class Test extends Component {
  constructor () {
    super()
    this.state = {
      msg: 'hello world'
    }
  }
  handleClick () {
    this.setState({
      msg: 'hello world new'
    })
  }
  render () {
    const { msg } = this.state
    return dom.div({}, 
      dom.button({
        onclick: () => this.handleClick()
      }, 'click'),
      msg
    )
  }
}

const app = new Test().render()
document.body.appendChild(app)