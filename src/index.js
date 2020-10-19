import React, { useContext } from 'react'
import generateComponentId from './utils/generateComponentId'
import { EMPTY_ARRAY } from './utils/empties'
import generateDisplayName from './utils/generateDisplayName'
import ComponentStyle from './ComponentStyle'
import createStylisInstance from './stylis'
import StyleSheet from './StyleSheet'
import { SC_VERSION } from './constis'

var domElements = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'marquee',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr', // SVG
  'circle',
  'clipPath',
  'defs',
  'ellipse',
  'foreignObject',
  'g',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'text',
  'tspan'
]
const ELEMENT_TYPE = 1

var styled = function styled(tag) {
  return constructWithOptions(createStyledComponent, tag)
}

domElements.forEach(function(domElement) {
  styled[domElement] = styled(domElement)
})

var StyleSheetContext = React.createContext()
var StylisContext = React.createContext()

var masterSheet = new StyleSheet()

var masterStylis = createStylisInstance()

function useStyleSheet() {
  return useContext(StyleSheetContext) || masterSheet
}

function useStylis() {
  return useContext(StylisContext) || masterStylis
}

function useInjectedStyle(componentStyle, hasAttrs, resolvedAttrs) {
  var styleSheet = useStyleSheet()
  var stylis = useStylis()
  // todo  generateAndInjectStyles插入css rules
  var className = componentStyle.generateAndInjectStyles(
    resolvedAttrs,
    styleSheet,
    stylis
  )
  return className
}

function useStyledComponentImpl(forwardedComponent, props) {
  var componentAttrs = forwardedComponent.attrs,
    componentStyle = forwardedComponent.componentStyle

  const { target, styledComponentId } = forwardedComponent

  const propsForElement = {}

  var generatedClassName = useInjectedStyle(
    componentStyle,
    componentAttrs.length > 0,
    props,
    undefined
  )
  console.log(generatedClassName)
  propsForElement.className = Array.prototype
    .concat(
      [],
      styledComponentId,
      generatedClassName !== styledComponentId ? generatedClassName : null,
      props.className,
      undefined
    )
    .filter(Boolean)
    .join(' ')
  return React.createElement(target, propsForElement)
}

const identifiers = {}

function generateId(displayName, parentComponentId) {
  const name = typeof displayName !== 'string' ? 'sc' : escape(displayName)
  identifiers[name] = (identifiers[name] || 0) + 1

  const componentId = `${name}-${generateComponentId(
    SC_VERSION + name + identifiers[name]
  )}`

  return parentComponentId ? `${parentComponentId}-${componentId}` : componentId
}

function createStyledComponent(target, options = {}, rules) {
  const {
    attrs = EMPTY_ARRAY,
    componentId = generateId(options.displayName, options.parentComponentId),
    displayName = generateDisplayName(target)
  } = options

  const styledComponentId =
    options.displayName && options.componentId
      ? `${escape(options.displayName)}-${options.componentId}`
      : options.componentId || componentId

  var WrappedStyledComponent
  var componentStyle = new ComponentStyle(rules, styledComponentId)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  var forwardRef = (props, ref) =>
    useStyledComponentImpl(WrappedStyledComponent, props, ref)

  forwardRef.displayName = 'displayName' // $FlowFixMe this is a forced cast to merge it StyledComponentWrapperProperties

  WrappedStyledComponent = React.forwardRef(forwardRef)
  WrappedStyledComponent.attrs = []
  WrappedStyledComponent.componentStyle = componentStyle
  WrappedStyledComponent.target = target
  WrappedStyledComponent.styledComponentId = styledComponentId

  return WrappedStyledComponent
}

function constructWithOptions(componentConstructor, tag, options) {
  var templateFunction = function templateFunction() {
    return componentConstructor(tag, options, css.apply(void 0, arguments))
  }

  templateFunction.withConfig = function(config) {
    return constructWithOptions(componentConstructor, tag, {})
  }

  return templateFunction
}

function css(styles) {
  for (
    var _len = arguments.length,
      interpolations = new Array(_len > 1 ? _len - 1 : 0),
      _key = 1;
    _key < _len;
    _key++
  ) {
    interpolations[_key - 1] = arguments[_key]
  }

  if (
    interpolations.length === 0 &&
    styles.length === 1 &&
    typeof styles[0] === 'string'
  ) {
    // $FlowFixMe
    return styles
  } // $FlowFixMe

  return interleave(styles, interpolations)
}

var interleave = function(strings, interpolations) {
  var result = [strings[0]]

  for (var i = 0, len = interpolations.length; i < len; i += 1) {
    result.push(interpolations[i], strings[i + 1])
  }

  return result
}

export { styled }
