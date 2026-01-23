/**
 * Polyfills for Node.js globals required by blockchain libraries
 * This file must be imported before any other code that uses Buffer, global, or process
 */

import { Buffer } from 'buffer'

// Ensure global is defined (for Node.js compatibility)
if (typeof global === 'undefined') {
  var global = globalThis
}

// Ensure process is defined (minimal polyfill for libraries that check process.env)
if (typeof process === 'undefined') {
  var process = {
    env: {},
    version: '',
    versions: {},
    browser: true,
    nextTick: (fn) => setTimeout(fn, 0),
  }
}

// Make Buffer available globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer
  window.global = global
  window.process = process
}

// Make Buffer available on globalThis
if (typeof globalThis !== 'undefined') {
  globalThis.Buffer = Buffer
  globalThis.global = global
  globalThis.process = process
}

// Make Buffer available on global (for Node.js-style code)
global.Buffer = Buffer
global.global = global
global.process = process

export { Buffer }
