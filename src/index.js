import React, { useContext } from 'react'
import ComponentStyle from './ComponentStyle'
import StyleSheet from './StyleSheet'

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

// var masterStylis = createStylisInstance();

function useStyleSheet() {
  return useContext(StyleSheetContext) || masterSheet
}

function useStylis() {
  return useContext(StylisContext)
  // return useContext(StylisContext) || masterStylis;
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
}

function useStyledComponentImpl(forwardedComponent, props) {
  var componentAttrs = forwardedComponent.attrs,
    componentStyle = forwardedComponent.componentStyle

  const { target } = forwardedComponent

  const propsForElement = {}

  var generatedClassName = useInjectedStyle(
    componentStyle,
    componentAttrs.length > 0,
    props,
    undefined
  )
  propsForElement.className = 'component'

  return React.createElement(target, propsForElement)
}

function createStyledComponent(target, options, rules) {
  var WrappedStyledComponent
  var componentStyle = new ComponentStyle(rules, 'sc-component')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  var forwardRef = (props, ref) =>
    useStyledComponentImpl(WrappedStyledComponent, props, ref)

  forwardRef.displayName = 'displayName' // $FlowFixMe this is a forced cast to merge it StyledComponentWrapperProperties

  WrappedStyledComponent = React.forwardRef(forwardRef)
  WrappedStyledComponent.attrs = []
  WrappedStyledComponent.componentStyle = componentStyle
  WrappedStyledComponent.target = target
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
