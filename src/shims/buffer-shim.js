// Export Buffer from the global placeholder injected in HTML.
// This avoids bundling the 'buffer' package and prevents bare specifiers in output.

const GlobalBuffer = (typeof globalThis !== 'undefined' && globalThis.Buffer) ? globalThis.Buffer : undefined;

// Ensure Buffer exists globally (critical for ethers and blockchain libraries)
if (typeof globalThis !== 'undefined' && !globalThis.Buffer && GlobalBuffer) {
  globalThis.Buffer = GlobalBuffer;
}

// Also ensure window has Buffer for browser access
if (typeof window !== 'undefined' && GlobalBuffer) {
  window.Buffer = GlobalBuffer;
}

export const Buffer = GlobalBuffer;
export default GlobalBuffer;

// Common helpers that libraries may access on Buffer
if (GlobalBuffer && typeof GlobalBuffer.byteLength !== 'function') {
  GlobalBuffer.byteLength = function (input) {
    if (typeof input === 'string') return new TextEncoder().encode(input).length;
    return input ? (input.length || input.byteLength || 0) : 0;
  };
}
