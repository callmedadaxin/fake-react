import React from './react'

const ReactReconciler = {
  mount(internalInstance, container) {
    return internalInstance.mount(container);
  }
};

/**
 * 负责渲染dom
 */
class ReactDOMComponent {
  constructor (element) {
    this._currentElement = element
  }
  mount (container) {
    const domElement = document.createElement(this._currentElement.type);
    const text = this._currentElement.props.children;
    const textNode = document.createTextNode(text);
    domElement.appendChild(textNode);

    container.appendChild(domElement);

    this._hostNode = domElement;
    return domElement;
  }
}

/**
 * 负责渲染组件
 */
class ReactDOMComponentWrapper {
  constructor (element) {
    this._currentElement = element
  }
  performInitialMount (container) {
    // 虚拟dom
    const element = this._instance.render()

    this._renderedComponent = instantiateReactComponent(element)

    return ReactReconciler.mount(this._renderedComponent, container)
  }
  mount (container) {
    const { type: Component, props } = this._currentElement

    this._instance = new Component(props)
    
    if (this._instance.componentWillMount) {
      this._instance.componentWillMount()
    }

    const markUp = this.performInitialMount(container)

    if (this._instance.componentDidMount) {
      this._instance.componentDidMount()
    }
    return markUp
  }
}

function instantiateReactComponent (element) {
  return typeof element.type === 'string'
    ? new ReactDOMComponent(element)
    : new ReactDOMComponentWrapper(element)
}

class Wrapper {
  constructor (props) {
    this.props = props
  }
  render () {
    return this.props
  }
}

const ReactDom = {
  render (element, container) {
    // 将基本的dom也处理为复合组件形式
    const wrappedElement = React.createElement(Wrapper, element)
    const instance = new ReactDOMComponentWrapper(wrappedElement)

    return ReactReconciler.mount(
      instance,
      container
    )
  }
}

export default ReactDom