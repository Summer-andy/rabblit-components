var SC_DISABLE_SPEEDY;
var __VERSION__ = '5.2';

export const SC_ATTR =
 (typeof process !== 'undefined' && (process.env.REACT_APP_SC_ATTR || process.env.SC_ATTR)) ||
 'data-styled';

export const SC_ATTR_ACTIVE = 'active';
export const SC_ATTR_VERSION = 'data-styled-version';
export const SC_VERSION = __VERSION__;
export const SPLITTER = '/*!sc*/\n';

export const IS_BROWSER = typeof window !== 'undefined' && 'HTMLElement' in window;

export const DISABLE_SPEEDY =
 Boolean(typeof SC_DISABLE_SPEEDY === 'boolean'
   ? SC_DISABLE_SPEEDY
   : (typeof process !== 'undefined' && typeof process.env.REACT_APP_SC_DISABLE_SPEEDY !== 'undefined' && process.env.REACT_APP_SC_DISABLE_SPEEDY !== ''
     ? process.env.REACT_APP_SC_DISABLE_SPEEDY === 'false' ? false : process.env.REACT_APP_SC_DISABLE_SPEEDY
     : (typeof process !== 'undefined' && typeof process.env.SC_DISABLE_SPEEDY !== 'undefined' && process.env.SC_DISABLE_SPEEDY !== ''
       ? process.env.SC_DISABLE_SPEEDY === 'false' ? false : process.env.SC_DISABLE_SPEEDY
       : process.env.NODE_ENV !== 'production'
     )
   ));

// Shared empty execution context when generating static styles
export const STATIC_EXECUTION_CONTEXT = {};