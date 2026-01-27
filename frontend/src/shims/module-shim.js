/**
 * CommonJS module shim for browser environment.
 * Prevents "Cannot read properties of undefined (reading 'exports')" errors
 * when blockchain libraries or their dependencies try to access module.exports
 */

// Create a proper module object if it doesn't exist
const createModuleObject = () => {
  return {
    exports: {},
    require: (id) => {
      console.warn(`⚠️  module.require() called with "${id}" in browser - this should not happen`);
      return undefined;
    }
  };
};

// Initialize module globally
if (typeof globalThis !== 'undefined') {
  if (!globalThis.module || !globalThis.module.exports) {
    globalThis.module = createModuleObject();
  }
}

if (typeof window !== 'undefined') {
  if (!window.module || !window.module.exports) {
    window.module = globalThis.module || createModuleObject();
  }
}

// Ensure module is accessible where needed
export const module = (typeof globalThis !== 'undefined' && globalThis.module) 
  ? globalThis.module 
  : createModuleObject();

export default module;
