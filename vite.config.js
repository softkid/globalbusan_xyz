import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

// Vite plugin to inject minimal global setup in HTML before any scripts
const bufferPolyfillPlugin = () => {
  return {
    name: 'buffer-polyfill-html',
    transformIndexHtml(html) {
      // Inject comprehensive setup before any modules
      const polyfillScript = `
  <script>
    // Comprehensive polyfill setup before any modules load
    (function() {
      // 1. Setup global object
      if (typeof window !== 'undefined') {
        if (typeof window.global === 'undefined') {
          window.global = window;
        }
        if (typeof globalThis !== 'undefined') {
          globalThis.global = globalThis;
        }
      }
      
      // 2. Setup process object with all required properties
      if (typeof process === 'undefined') {
        var processObj = { 
          env: {
            NODE_ENV: 'production'
          }, 
          browser: true, 
          version: 'v18.0.0', 
          versions: {
            node: '18.0.0'
          },
          platform: 'browser',
          nextTick: function(fn) { 
            Promise.resolve().then(fn);
          },
          cwd: function() { return '/'; },
          argv: [],
          pid: 1,
          stdout: {},
          stderr: {},
          stdin: {}
        };
        
        if (typeof window !== 'undefined') {
          window.process = processObj;
        }
        if (typeof globalThis !== 'undefined') {
          globalThis.process = processObj;
        }
        if (typeof window !== 'undefined' && window.global) {
          window.global.process = processObj;
        }
      }
      
      // 3. Pre-setup Buffer placeholder (will be replaced by actual Buffer from module)
      // This prevents "Cannot read properties of undefined" errors
      if (typeof Buffer === 'undefined') {
        var BufferPlaceholder = function() {
          console.warn('Buffer called before polyfill loaded. Ensure polyfills.js is imported first.');
        };
        BufferPlaceholder.from = function() { return new Uint8Array(); };
        BufferPlaceholder.alloc = function() { return new Uint8Array(); };
        BufferPlaceholder.isBuffer = function() { return false; };
        
        if (typeof window !== 'undefined') {
          window.Buffer = BufferPlaceholder;
        }
        if (typeof globalThis !== 'undefined') {
          globalThis.Buffer = BufferPlaceholder;
        }
        if (typeof window !== 'undefined' && window.global) {
          window.global.Buffer = BufferPlaceholder;
        }
      }
      
      console.log('🔧 Pre-polyfills setup complete (global, process, Buffer placeholder)');
    })();
  </script>`
        
      // Insert polyfill script before the first <script type="module">
      if (html.includes('<script type="module"')) {
        return html.replace(/(<script type="module"[^>]*>)/, polyfillScript + '\n  $1')
      }
      return html.replace('</head>', polyfillScript + '\n  </head>')
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), bufferPolyfillPlugin()],
  define: {
    'global': 'globalThis',
    'process.env': '{}',
    // Inject Buffer directly at build time
    'global.Buffer': 'globalThis.Buffer',
    'window.Buffer': 'globalThis.Buffer',
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
            // Don't separate buffer - let it be included where needed
            // This prevents "Cannot read Buffer" errors in blockchain-vendor
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('@stripe')) {
              return 'stripe-vendor'
            }
            // Include buffer WITH blockchain libraries to ensure it's available
            if (id.includes('ethers') || id.includes('@solana') || id.includes('web3') || id.includes('/buffer/')) {
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
      // Buffer MUST be first to ensure it's available for blockchain libraries
      'buffer',
      'react',
      'react-dom',
      'react-router-dom',
      'ethers',
      '@solana/web3.js',
      'recharts',
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
