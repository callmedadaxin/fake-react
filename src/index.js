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
      count: 1,
      showContent: false
    }
  }
  handleClick () {
    this.setState({
      count: ++this.state.count
    })
  }
  addDom () {
    this.setState({
      showContent: !this.state.showContent
    })
  }
  render () {
    const { msg, count, showContent } = this.state
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
      dom.button({
        onclick: () => this.addDom()
      }, '点我展示节点'),
      msg+count,
      new Child({ count }).render(),
      showContent ? new Child({ count: count * 2 }).render() : 'ssss'
    )
  }
}

render(Test, '#app')
