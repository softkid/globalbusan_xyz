/**
 * Polyfills for Node.js globals required by blockchain libraries
 * This file must be imported before any other code that uses Buffer, global, or process
 */

import { Buffer } from 'buffer'

// Ensure global is defined (for Node.js compatibility)
if (typeof window !== 'undefined') {
  if (typeof window.global === 'undefined') {
    window.global = window
  }
  if (typeof globalThis !== 'undefined' && typeof globalThis.global === 'undefined') {
    globalThis.global = globalThis
  }
}

// Ensure process is defined (minimal polyfill for libraries that check process.env)
if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
  window.process = {
    env: {},
    version: '',
    versions: {},
    browser: true,
    nextTick: (fn) => setTimeout(fn, 0),
  }
}

if (typeof globalThis !== 'undefined' && typeof globalThis.process === 'undefined') {
  globalThis.process = window.process
}

// Make Buffer available globally on all possible global objects
if (typeof window !== 'undefined') {
  window.Buffer = Buffer
}

if (typeof globalThis !== 'undefined') {
  globalThis.Buffer = Buffer
}

if (typeof window !== 'undefined' && window.global) {
  window.global.Buffer = Buffer
  window.global.process = window.process
}

console.log('✅ Polyfills loaded: Buffer available globally')

export { Buffer }
