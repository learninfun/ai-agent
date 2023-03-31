// myModule.mjs (for ESM)
export function foo() {
    console.log('Hello from ESM!');
  }
  
  // myModule.js (for CommonJS)
  function bar() {
    console.log('Hello from CommonJS!');
  }
  
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = { bar };
  } else {
    export { foo };
  }