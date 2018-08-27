export class Component {
  constructor (props) {
    this.props = props
  }
  render () {}
}

export default {
  createElement (type, props, children) {
    const element = {
      type,
      props: props || {}
    }
    element.props.children = children

    return element
  }
}
