import { makeStyleTag } from './Dom'

export const makeTag = ({ isServer, useCSSOMInjection, target }) => {
  return new TextTag(target)
}

export class TextTag {
  constructor(target) {
    const element = (this.element = makeStyleTag(target))
    this.nodes = element.childNodes
    this.length = 0
  }

  insertRule(index, rule) {
    const node = document.createTextNode(rule[0])
    console.log(node)
    const refNode = this.nodes[index]
    this.element.insertBefore(node, refNode || null)
    this.length++
    return true
  }
}
