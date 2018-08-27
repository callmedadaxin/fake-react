import React from './react'
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
  mount (container) {
    const { type: Component, props } = this._currentElement

    // 获取虚拟dom
    const componentInstance = new Component(props)
    let element = componentInstance.render()
    
    // 继续处理组件，知道获得type为真实dom的
    while (typeof element.type === 'function') {
      element = (new element.type(element.props)).render();
    }
    
    const domInstance = new ReactDOMComponent(element)
    return domInstance.mount(container)
  }
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
    const wrappedElement = React.createElement(Wrapper, element)
    return new ReactDOMComponentWrapper(wrappedElement).mount(container)
  }
}

export default ReactDom