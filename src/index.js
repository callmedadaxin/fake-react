
import React, { Component } from './v4/react'
import ReactDom from './v4/react-dom'

// 简单组件
class Title extends Component {
  constructor (props) {
    super(props)
    this.state = {
      count: 1
    }
  }
  componentWillMount () {
    console.log('title will mount')
  }
  componentDidMount () {
    console.log('title did mount')
    setInterval(() => {
      this.setState({
        count: this.state.count + 1
      })
    }, 1000)
    setInterval(() => {
      this.setState({
        count: this.state.count + 1
      })
    }, 1000)
  }
  render () {
    return React.createElement(
      'h1',
      null,
      `${this.props.msg}-${this.state.count}`
    )
  }
}

// 复合组件
class App extends Component {
  componentWillMount () {
    console.log('app will mount')
  }
  componentDidMount () {
    console.log('app did mount')
  }
  render () {
    const { asTitle, msg } = this.props

    return asTitle
      ? React.createElement(Title, {
        msg
      })
      : React.createElement('p', null, msg)
  }
}

ReactDom.render(
  React.createElement(App, {
    msg: 'hello world',
    asTitle: true
  }),
  document.querySelector('body')
)

setTimeout(() => {
  ReactDom.render(
    React.createElement(App, {
      msg: 'hello world again',
      asTitle: true
    }),
    document.querySelector('body')
  )
}, 2000);