import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

// Vite plugin to inject minimal global setup in HTML before any scripts
const bufferPolyfillPlugin = () => {
  return {
    name: 'buffer-polyfill-html',
    transformIndexHtml(html) {
      // Only inject minimal global/process setup - Buffer comes from bundled polyfills.js
      const polyfillScript = `
  <script>
    // Minimal setup before modules load
    (function() {
      // Setup global
      if (typeof window !== 'undefined' && typeof global === 'undefined') {
        window.global = window;
        if (typeof globalThis !== 'undefined') {
          globalThis.global = globalThis;
        }
      }
      // Setup minimal process
      if (typeof process === 'undefined') {
        var processObj = { 
          env: {}, 
          browser: true, 
          version: '', 
          versions: {},
          nextTick: function(fn) { setTimeout(fn, 0); }
        };
        window.process = processObj;
        if (typeof globalThis !== 'undefined') {
          globalThis.process = processObj;
        }
      }
    })();
  </script>`
      // Insert before the first <script type="module">
      if (html.includes('<script type="module"')) {
        return html.replace(/(<script type="module"[^>]*>)/, polyfillScript + '\n  $1')
      }
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
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  build: {
    // Code splitting optimization
    rollupOptions: {
      plugins: [
        // Node polyfills - automatically handles Buffer/process in all chunks
        rollupNodePolyFill(),
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
