import Component from './base'
import Dom from './vdom'
import render from './render'

const dom = new Dom()

class Child extends Component {
  render () {
    const {count} = this.props
    return dom.p({}, `count * count = ${count * count}`)
  }
}

class Test extends Component {
  constructor () {
    super()
    this.state = {
      msg: 'hello world',
      count: 1
    }
  }
  handleClick () {
    this.setState({
      count: ++this.state.count
    })
  }
  render () {
    const { msg, count } = this.state
    return dom.div({
      class: `${200 + count}px`,
      style: {
        color: 'red',
        fontSize: 10 + count + 'px'
      }
    }, 
      dom.button({
        onclick: () => this.handleClick()
      }, 'click'),
      msg+count,
      new Child({ count }).render(),
      new Child({ count: count * 2 }).render()
    )
  }
}

render(Test, '#app')
