# Bundler Polyfills Guide (Buffer, process, globals)

This guide explains how to avoid Buffer-related errors across bundlers (Webpack 5, Parcel 2, esbuild, Rollup) and browser-only environments like Cloudflare Pages.

## Why errors happen
- Node globals like `Buffer`, `process`, `global` aren't available in browsers.
- Modern bundlers (e.g., Webpack 5) no longer auto-polyfill Node built-ins.
- Blockchain libs (`ethers`, `@solana/web3.js`) sometimes touch `Buffer` even in browser builds.

## Cross-bundler strategy
- Prefer an HTML-first polyfill that sets `globalThis.Buffer` before any modules load.
- Keep the `buffer` package out of the bundle (external) to prevent chunk leakage.
- Ensure `globalThis` and `window.global` exist; provide a minimal `process` stub.

## Webpack 5
Use `resolve.fallback` + `ProvidePlugin`, optionally `node-polyfill-webpack-plugin`.

```js
// webpack.config.js
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  // ...entry/output
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: ['process'],
    }),
    new NodePolyfillPlugin(), // optional
  ],
  optimization: { splitChunks: { chunks: 'all' } },
};
```

## Next.js (Webpack 5)
Add a `webpack` override in `next.config.js`:

```js
// next.config.js
const webpack = require('webpack');
module.exports = {
  webpack(config) {
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
    };
    config.plugins.push(
      new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'], process: ['process'] })
    );
    return config;
  },
};
```

## Parcel 2
Parcel provides many polyfills automatically, but it's safer to set `Buffer` explicitly in your entry:

```js
// src/polyfills.js
import { Buffer } from 'buffer';
window.global = window;
window.Buffer = Buffer;
globalThis.Buffer = Buffer;
window.process = { env: {}, browser: true, nextTick: (fn) => setTimeout(fn, 0) };
```

Ensure the entry imports `polyfills.js` first.

## esbuild
Use `@esbuild-plugins/node-globals-polyfill` and define `global`:

```js
// build.mjs
import esbuild from 'esbuild';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

await esbuild.build({
  entryPoints: ['src/main.jsx'],
  bundle: true,
  outdir: 'dist',
  define: { global: 'globalThis' },
  plugins: [NodeGlobalsPolyfillPlugin({ buffer: true, process: true })],
});
```

Optionally inject a `polyfills.js` file and ensure it imports first.

## Rollup
Use `rollup-plugin-node-polyfills` or inject an HTML-first placeholder:

```js
// rollup.config.mjs
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {
  // ...
  plugins: [nodePolyfills()],
};
```

## Cloudflare Pages/Workers
- Prefer an inline script in `index.html` that sets `Buffer`, `globalThis`, and a minimal `process` before modulepreload tags.
- This guarantees availability regardless of bundler order.

## Notes
- Keep `buffer` external if you rely on an HTML placeholder to avoid chunk circularities.
- Always test in production-like builds; dev servers often mask missing globals.
