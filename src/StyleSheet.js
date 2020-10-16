import { makeTag } from './Tag';
let groupIDRegister = new Map();
let reverseRegister = new Map();
let nextFreeGroup = 1;
const MAX_SMI = 1 << 31 - 1;

const getGroupForId = (id) => {
  if (groupIDRegister.has(id)) {
    return (groupIDRegister.get(id));
  }

  while (reverseRegister.has(nextFreeGroup)) {
    nextFreeGroup++;
  }

  const group = nextFreeGroup++;

  groupIDRegister.set(id, group);
  reverseRegister.set(group, id);
  return group;
};


const defaultOptions = {
  isServer:false,
  useCSSOMInjection: true,
};

export default class StyleSheet {

  static registerId() {

  }

  constructor(
    options,
    globalStyles={},
    names
  ) {
    this.options = { ...options, ...defaultOptions };
    this.gs = globalStyles;
    this.names = new Map(names);

  }


  registerName(id, name) {
    getGroupForId(id);

    if (!this.names.has(id)) {
      const groupNames = new Set();
      groupNames.add(name);
      this.names.set(id, groupNames);
    } else {
      (this.names.get(id)).add(name);
    }
  }

  insertRules(id, name, rules) {
    // this.registerName(id, name);
    this.getTag().insertRule(getGroupForId(id), rules);
  }

  getTag() {
    return this.tag || (this.tag = makeTag(this.options));
  }

}