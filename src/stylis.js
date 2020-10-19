import Stylis from '@emotion/stylis';
import { EMPTY_ARRAY, EMPTY_OBJECT } from './utils/empties';
import { phash, SEED } from './utils/hash';
import insertRulePlugin from './utils/stylisPluginInsertRule';
const COMPLEX_SELECTOR_PREFIX = [':', '[', '.', '#'];
const COMMENT_REGEX = /^\s*\/\/.*$/gm;

export default function createStylisInstance({
  options = EMPTY_OBJECT,
  plugins = EMPTY_ARRAY,
} = EMPTY_OBJECT) {
  const stylis = new Stylis(options);
  let parsingRules = [];
  const returnRulesPlugin = context => {
    if (context === -2) {
      const parsedRules = parsingRules;
      parsingRules = [];
      return parsedRules;
    }
  };

  const parseRulesPlugin = insertRulePlugin(rule => {
    parsingRules.push(rule);
  });

  let _componentId;
  let _selector;
  let _selectorRegexp;
  let _consecutiveSelfRefRegExp;

  const selfReferenceReplacer = (match, offset, string) => {
    if (
      (offset === 0 ? !COMPLEX_SELECTOR_PREFIX.includes(string[_selector.length]) : true) &&
      !string.match(_consecutiveSelfRefRegExp)
    ) {
      return `.${_componentId}`;
    }

    return match;
  };

  const selfReferenceReplacementPlugin = (context, _, selectors) => {
    if (context === 2 && selectors.length && selectors[0].lastIndexOf(_selector) > 0) {
      selectors[0] = selectors[0].replace(_selectorRegexp, selfReferenceReplacer);
    }
  };

  stylis.use([...plugins, selfReferenceReplacementPlugin, parseRulesPlugin, returnRulesPlugin]);

  function stringifyRules(css, selector, prefix, componentId = '&') {
    const flatCSS = css.replace(COMMENT_REGEX, '');
    const cssStr = selector && prefix ? `${prefix} ${selector} { ${flatCSS} }` : flatCSS;
    _componentId = componentId;
    _selector = selector;
    _selectorRegexp = new RegExp(`\\${_selector}\\b`, 'g');
    _consecutiveSelfRefRegExp = new RegExp(`(\\${_selector}\\b){2,}`);

    return stylis(prefix || !selector ? '' : selector, cssStr);
  }

  stringifyRules.hash = plugins.length
    ? plugins
        .reduce((acc, plugin) => {
          if (!plugin.name) {
            console.log('error');
          }

          return phash(acc, plugin.name);
        }, SEED)
        .toString()
    : '';


  return stringifyRules;
}
