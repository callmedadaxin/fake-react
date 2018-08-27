import { ReactReconciler, ReactInstanceMap } from './react-dom'

export class Component {
  constructor (props) {
    this.props = props
  }
  setState (partialState) {
    const instance = ReactInstanceMap.get(this)

    // 批量存储
    instance._pendingPartialState = instance._pendingPartialState || []
    instance._pendingPartialState.push(partialState)
    
    if (!instance._rendering) {
      ReactReconciler.performUpdateIfNecessary(instance)
    }
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
