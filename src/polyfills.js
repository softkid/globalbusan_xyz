/**
 * Polyfills for Node.js globals required by blockchain libraries.
 * This file must be imported before any other code.
 * Do NOT import 'buffer' here; rely on the HTML placeholder or global Buffer.
 */

// Ensure global and process exist in browser FIRST (top priority)
if (typeof window !== 'undefined') {
  window.global = window
  window.process = window.process || { env: {}, browser: true, nextTick: (fn) => setTimeout(fn, 0) }
  // Also ensure globalThis has process
  if (typeof globalThis !== 'undefined') {
    globalThis.process = window.process
    globalThis.global = window
  }
}

// Ensure globalThis has process/global if window doesn't exist (rare, but for completeness)
if (typeof globalThis !== 'undefined' && typeof globalThis.process === 'undefined') {
  globalThis.process = { env: {}, browser: true, nextTick: (fn) => setTimeout(fn, 0) }
  globalThis.global = typeof globalThis !== 'undefined' ? globalThis : {}
}

// Ensure module object exists (prevents "Cannot read properties of undefined (reading 'exports')")
if (typeof module === 'undefined' || !module.exports) {
  const moduleObj = { exports: {} }
  if (typeof window !== 'undefined') {
    window.module = moduleObj
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.module = moduleObj
  }
}

// Ensure Buffer exists globally (prefer HTML-injected placeholder)
if (typeof globalThis !== 'undefined' && typeof globalThis.Buffer !== 'undefined') {
  if (typeof window !== 'undefined') {
    window.Buffer = globalThis.Buffer
  }
} else {
  // Minimal, safe fallback (rarely used since HTML placeholder should define Buffer)
  const encoder = new TextEncoder()
  const FallbackBuffer = function (arg) {
    if (arg instanceof Uint8Array) return arg
    if (typeof arg === 'number') return new Uint8Array(arg)
    if (typeof arg === 'string') return encoder.encode(arg)
    if (Array.isArray(arg)) return new Uint8Array(arg)
    return new Uint8Array(0)
  }
  FallbackBuffer.isBuffer = (obj) => obj instanceof Uint8Array
  FallbackBuffer.from = (value) => FallbackBuffer(value)
  FallbackBuffer.alloc = (size, fill) => {
    const buf = new Uint8Array(size)
    if (fill !== undefined) buf.fill(typeof fill === 'number' ? fill : 0)
    return buf
  }
  FallbackBuffer.byteLength = (input) => {
    if (typeof input === 'string') return encoder.encode(input).length
    return input ? (input.length || input.byteLength || 0) : 0
  }
  if (typeof window !== 'undefined') {
    window.Buffer = FallbackBuffer
  }
}

console.log('✅ Polyfills loaded: Buffer available globally')
