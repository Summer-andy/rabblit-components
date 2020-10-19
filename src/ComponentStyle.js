import { SC_VERSION } from './constis';
import generateName from './utils/generateAlphabeticName';
import { hash, phash } from './utils/hash';

const SEED = hash(SC_VERSION);

export default class ComponentStyle {
  constructor(rules, componentId, baseStyle) {
    this.rules = rules;
    this.staticRulesId = '';
    this.isStatic = false;
    this.componentId = componentId;
    this.baseHash = phash(SEED, componentId);
    this.baseStyle = baseStyle;
  }

  generateAndInjectStyles(executionContext, styleSheet, stylis) {
    const { length } = this.rules;
    var componentId = this.componentId;
    let dynamicHash = phash(this.baseHash, '');
    let css = '';
    const names = [];

    for (let i = 0; i < length; i++) {
      const partRule = this.rules[i];

      if (typeof partRule === 'string') {
        css += partRule;

      dynamicHash = phash(dynamicHash, partRule + i);
      } 
    }

    if (css) {
      var name = generateName(dynamicHash >>> 0);
        const cssFormat = stylis(css, `.${name}`, undefined, componentId);
        styleSheet.insertRules(componentId, name, cssFormat);
        names.push(name);
    }
    return names.join(' ');
  }
}
