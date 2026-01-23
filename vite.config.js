import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

// Vite plugin to inject Buffer polyfill in HTML before any scripts
const bufferPolyfillPlugin = () => {
  return {
    name: 'buffer-polyfill-html',
    transformIndexHtml(html) {
      // Inject polyfill script that loads synchronously before any module scripts
      const polyfillScript = `
  <script>
    // Buffer polyfill - must run before any module scripts
    (function() {
      // Set up global object
      if (typeof global === 'undefined') {
        if (typeof globalThis !== 'undefined') {
          globalThis.global = globalThis;
        } else if (typeof window !== 'undefined') {
          window.global = window;
        }
      }
      // Set up process object
      if (typeof process === 'undefined') {
        const processObj = { env: {}, browser: true, version: '', versions: {} };
        if (typeof globalThis !== 'undefined') {
          globalThis.process = processObj;
        }
        if (typeof window !== 'undefined') {
          window.process = processObj;
        }
      }
    })();
  </script>`
      // Insert before the first <script type="module"> or before </head>
      // Try to insert before module scripts first
      if (html.includes('<script type="module"')) {
        return html.replace(/(<script type="module"[^>]*>)/, polyfillScript + '\n  $1')
      }
      // Fallback to before </head>
      return html.replace('</head>', polyfillScript + '\n  </head>')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), bufferPolyfillPlugin()],
  define: {
    'global': 'globalThis',
    'process.env': '{}',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  build: {
    // Code splitting optimization
    rollupOptions: {
      plugins: [
        // Node polyfills so vendor chunks (ethers/solana) can safely access Buffer/process
        rollupNodePolyFill(),
        // Plugin to ensure Buffer polyfill is available in vendor chunks
        {
          name: 'buffer-polyfill-inject',
          renderChunk(code, chunk) {
            // Only inject into blockchain-vendor chunk
            if (chunk.name === 'blockchain-vendor' || chunk.name?.includes('blockchain')) {
              // Inject code that imports and sets up Buffer at the top of the chunk
              // This uses a dynamic import that will be resolved by Vite
              const polyfillSetup = `import { Buffer } from 'buffer';
// Ensure globals exist - use globalThis to set the actual global object
if (typeof global === 'undefined') { 
  if (typeof globalThis !== 'undefined') { globalThis.global = globalThis; }
  else if (typeof window !== 'undefined') { window.global = window; }
}
if (typeof process === 'undefined') { 
  const processObj = { env: {}, browser: true };
  if (typeof globalThis !== 'undefined') { globalThis.process = processObj; }
  if (typeof window !== 'undefined') { window.process = processObj; }
}
// Set Buffer globally on all possible global objects
const globalObj = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});
globalObj.Buffer = Buffer;
if (typeof window !== 'undefined') { window.Buffer = Buffer; }
if (typeof globalThis !== 'undefined') { globalThis.Buffer = Buffer; }
if (typeof global !== 'undefined') { global.Buffer = Buffer; }
`
              return {
                code: polyfillSetup + code,
                map: null
              }
            }
            return null
          }
        }
      ],
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('@stripe')) {
              return 'stripe-vendor'
            }
            if (id.includes('ethers') || id.includes('@solana') || id.includes('web3')) {
              return 'blockchain-vendor'
            }
            if (id.includes('gsap')) {
              return 'animation-vendor'
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n-vendor'
            }
            if (id.includes('recharts')) {
              return 'charts-vendor'
            }
            // Other large vendor libraries
            return 'vendor'
          }
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Source maps for production debugging (disabled for smaller builds)
    sourcemap: false,
    // Minification
    minify: 'esbuild',
    // Target modern browsers for smaller bundle (ES2020 required for BigInt support)
    target: 'es2020',
    // CSS code splitting
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: true,
    // Empty output directory
    emptyOutDir: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'ethers',
      '@solana/web3.js',
      'recharts',
      'buffer',
    ],
    exclude: ['@walletconnect'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        // Provide Buffer/process during dev optimize step
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  // Server configuration for preview
  server: {
    port: 3000,
    open: false,
  },
  preview: {
    port: 4173,
    open: true,
  },
})
