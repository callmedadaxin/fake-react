import React from './react'

export const ReactInstanceMap = {
  set (key, value) {
    key.__reactInternalInstance = value
  },
  get (key) {
    return key.__reactInternalInstance
  }
}

export const ReactReconciler = {
  mount(internalInstance, container) {
    return internalInstance.mount(container);
  },
  performUpdateIfNecessary (internalInstance) {
    internalInstance.performUpdateIfNecessary()
  }
};

/**
 * 负责渲染dom
 */
class ReactDOMComponent {
  constructor (element) {
    this._currentElement = element
  }
  receiveComponent (nextElement) {
    const prevElement = this._currentElement
    this.updateComponent(prevElement, nextElement)
  }
  updateComponent (prevElement, nextElement) {
    const { props: lastProps } = prevElement
    const { props: nextProps } = nextElement

    // updateDOM
    this._updateDOMChildren(lastProps, nextProps)

    this._currentElement = nextElement
  }
  updateTextContent (text) {
    const node = this._hostNode
    const firstChild = node.firstChild

    if (firstChild && firstChild === node.lastChild && firstChild.nodeType === 3) {
      return firstChild.nodeValue = text
    }
    firstChild.textContent = text
  }
  _updateDOMProperties () {
    // ...
  }
  _updateDOMChildren (lastProps, nextProps) {
    const { children: lastContent } = lastProps
    const { children: nextContent } = nextProps

    // 目前只处理文本
    if (!nextContent) {
      this.updateTextContent('')
    } else if (lastContent !== nextContent) {
      this.updateTextContent(nextContent)
    }
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
  performUpdateIfNecessary () {
    this.updateComponent(this._currentElement, this._currentElement)
  }
  receiveComponent (nextElement) {
    const prevElement = this._currentElement
    this.updateComponent(prevElement, nextElement)
  }
  // 进行props更新，然后重新触发render
  updateComponent (prevElement, nextElement) {
    const instance = this._instance
    this._currentElement = nextElement
    this._rendering = true

    const willReceive = prevElement !== nextElement

    // 获取next state
    const nextState = this._processPendingState()

    if (willReceive && instance.componentWillReceiveProps) {
      instance.componentWillReceiveProps(nextElement.props)
    }

    const shouldUpdate = instance.shouldComponentUpdate
      ? instance.shouldComponentUpdate(nextElement.props, nextState)
      : true
    
    
    instance.props = nextElement.props
    instance.state = nextState

    if (shouldUpdate) {
      this._updateRenderedComponent()
    }
    this._rendering = false
  }
  _processPendingState () {
    const instance = this._instance
    const _pendingPartialState = this._pendingPartialState

    if (!_pendingPartialState) {
      return instance.state
    }

    let nextState = instance.state

    for (let i = 0; i < _pendingPartialState.length; i++) {
      nextState = Object.assign(nextState, _pendingPartialState[i])
    }
    this._pendingPartialState = null
    return nextState
  }
  _updateRenderedComponent () {
    const prevComponentInstance = this._renderedComponent
    const nextRenderedElement = this._instance.render()
    prevComponentInstance.receiveComponent(nextRenderedElement)
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

    ReactInstanceMap.set(this._instance, this)
    
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
    const prevComponent = getTopLevelComponent(container)
    if (prevComponent) {
      return updateRootComponent(
        prevComponent,
        element
      )
    } else {
      return renderNewRootComponent(element, container)
    }
  }
}

function renderNewRootComponent(element, container) {
  // 将基本的dom也处理为复合组件形式
  const wrappedElement = React.createElement(Wrapper, element)
  const instance = new ReactDOMComponentWrapper(wrappedElement)

  const markUp = ReactReconciler.mount(
    instance,
    container
  )

  // 将组件实例进行记录
  container.__instance = instance._renderedComponent

  return markUp
}

function getTopLevelComponent(container) {
  return container.__instance
}
function updateRootComponent(prevComponent, nextElement) {
  prevComponent.receiveComponent(nextElement)
}

export default ReactDom