import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// Vite plugin to inject minimal global setup in HTML before any scripts
const bufferPolyfillPlugin = () => {
  return {
    name: 'buffer-polyfill-html',
    transformIndexHtml(html) {
      // Inject comprehensive setup before any modules
      const polyfillScript = `
  <script>
    // CRITICAL: Initialize globals BEFORE any modules load
    // This prevents "Cannot access 'JI' before initialization" errors
    (function() {
      // 1. Setup global object - MUST BE FIRST
      if (typeof window !== 'undefined') {
        if (typeof window.global === 'undefined') {
          window.global = window;
        }
        if (typeof globalThis !== 'undefined' && globalThis) {
          globalThis.global = globalThis;
        }
      }
      
      // 2. Setup process object with all required properties
      if (typeof process === 'undefined' || !process.env) {
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
        
        // Set process on window first (primary target)
        if (typeof window !== 'undefined' && window) {
          try {
            window.process = processObj;
          } catch (e) {
            console.warn('Could not set window.process:', e);
          }
        }
        // Then on globalThis (secondary target)
        if (typeof globalThis !== 'undefined' && globalThis) {
          try {
            globalThis.process = processObj;
          } catch (e) {
            console.warn('Could not set globalThis.process:', e);
          }
        }
        // Then on window.global if it exists
        if (typeof window !== 'undefined' && window && window.global) {
          try {
            window.global.process = processObj;
          } catch (e) {
            console.warn('Could not set window.global.process:', e);
          }
        }
      }
      
      // 3. Setup module object for CommonJS compat (prevents "Cannot read properties of undefined (reading 'exports')")
      if (typeof module === 'undefined' || !module.exports) {
        var moduleObj = {
          exports: {}
        };
        if (typeof window !== 'undefined' && window) {
          try {
            window.module = moduleObj;
          } catch (e) {
            console.warn('Could not set window.module:', e);
          }
        }
        if (typeof globalThis !== 'undefined' && globalThis) {
          try {
            globalThis.module = moduleObj;
          } catch (e) {
            console.warn('Could not set globalThis.module:', e);
          }
        }
      }
      
      // 4. Setup Array/Object static methods that dependencies might use
      // This prevents temporal dead zone (TDZ) errors with variables like 'JI'
      if (typeof Object.defineProperty !== 'function') {
        // Should always exist, but guard it anyway
        console.warn('Object.defineProperty not available');
      }
      
      // 5. Pre-setup Buffer placeholder (will be replaced by actual Buffer from module)
      // This prevents "Cannot read properties of undefined" errors
      if (typeof Buffer === 'undefined') {
        // Create a more complete Buffer placeholder that mimics real Buffer API
        var BufferPlaceholder = function(arg, encodingOrOffset, length) {
          // Basic constructor
          if (arg instanceof Uint8Array) {
            return arg;
          }
          if (typeof arg === 'number') {
            return new Uint8Array(arg);
          }
          if (typeof arg === 'string') {
            var encoder = new TextEncoder();
            return encoder.encode(arg);
          }
          if (Array.isArray(arg)) {
            return new Uint8Array(arg);
          }
          return new Uint8Array(0);
        };
        
        // Static methods
        BufferPlaceholder.from = function(value, encodingOrOffset, length) {
          if (value instanceof Uint8Array) {
            return value;
          }
          if (typeof value === 'string') {
            var encoder = new TextEncoder();
            return encoder.encode(value);
          }
          if (Array.isArray(value)) {
            return new Uint8Array(value);
          }
          return new Uint8Array(0);
        };
        
        BufferPlaceholder.alloc = function(size, fill, encoding) {
          var buf = new Uint8Array(size);
          if (fill !== undefined) {
            buf.fill(fill);
          }
          return buf;
        };
        
        BufferPlaceholder.allocUnsafe = function(size) {
          return new Uint8Array(size);
        };
        
        BufferPlaceholder.isBuffer = function(obj) {
          return obj instanceof Uint8Array;
        };
        
        BufferPlaceholder.byteLength = function(string, encoding) {
          if (typeof string === 'string') {
            var encoder = new TextEncoder();
            return encoder.encode(string).length;
          }
          return string ? string.length || string.byteLength || 0 : 0;
        };
        
        BufferPlaceholder.concat = function(list, totalLength) {
          if (!Array.isArray(list)) {
            return new Uint8Array(0);
          }
          
          if (list.length === 0) {
            return new Uint8Array(0);
          }
          
          var length = totalLength !== undefined ? totalLength : list.reduce(function(acc, buf) {
            return acc + (buf.length || buf.byteLength || 0);
          }, 0);
          
          var result = new Uint8Array(length);
          var offset = 0;
          
          for (var i = 0; i < list.length; i++) {
            var buf = list[i];
            result.set(buf, offset);
            offset += buf.length || buf.byteLength || 0;
          }
          
          return result;
        };
        
        // Set globally - with PROPER guards to prevent "Cannot set properties of undefined"
        if (typeof window !== 'undefined' && window) {
          try {
            window.Buffer = BufferPlaceholder;
          } catch (e) {
            console.warn('Could not set window.Buffer:', e);
          }
        }
        if (typeof globalThis !== 'undefined' && globalThis) {
          try {
            globalThis.Buffer = BufferPlaceholder;
          } catch (e) {
            console.warn('Could not set globalThis.Buffer:', e);
          }
        }
        if (typeof window !== 'undefined' && window && window.global) {
          try {
            window.global.Buffer = BufferPlaceholder;
          } catch (e) {
            console.warn('Could not set window.global.Buffer:', e);
          }
        }
      }
      
      console.log('🔧 Pre-polyfills setup complete (global, process, module, Buffer placeholder)');
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
    'process': 'globalThis.process',
    'module': 'globalThis.module',
    // Inject Buffer directly at build time
    'global.Buffer': 'globalThis.Buffer',
    'window.Buffer': 'globalThis.Buffer',
  },
  resolve: {
    alias: [
      // Ensure module shim is available to prevent CommonJS access errors
      { find: 'module', replacement: '/src/shims/module-shim.js' },
      // Ensure any import 'buffer' resolves to our shim (prevents bare specifier in output)
      { find: 'buffer', replacement: '/src/shims/buffer-shim.js' },
      { find: 'buffer/', replacement: '/src/shims/buffer-shim.js' },
      { find: 'process', replacement: 'process/browser' },
      { find: 'stream', replacement: 'stream-browserify' },
      { find: 'util', replacement: 'util' },
    ],
  },
  build: {
    // Specify output directory for Cloudflare Pages
    outDir: 'dist',
    // Code splitting optimization
    rollupOptions: {
      plugins: [
        // Custom plugin to detect if buffer leaks into vendor chunk
        {
          name: 'buffer-chunk-enforcer',
          renderChunk(code, chunk) {
            if (chunk.name === 'vendor' && (code.includes('buffer') || code.includes('Buffer'))) {
              console.warn('⚠️  WARNING: Buffer detected in vendor chunk, should be in blockchain-vendor');
            }
            return null;
          }
        }
      ],
      output: {
        // Prevent circular dependencies
        format: 'es',
        manualChunks: (id, context) => {
          // Vendor chunks - prioritize EARLY to prevent leakage
          if (id.includes('node_modules')) {
            // CRITICAL: Buffer and its dependencies MUST be in blockchain-vendor FIRST
            if (id.includes('/buffer/') || id.includes('\\buffer\\') ||
                id.includes('/base64-js/') || id.includes('\\base64-js\\') ||
                id.includes('/ieee754/') || id.includes('\\ieee754\\')) {
              return 'blockchain-vendor'
            }
            
            // Blockchain and crypto libraries - isolated chunk to prevent circular deps
            if (id.includes('ethers') || id.includes('@solana') || id.includes('web3') ||
                id.includes('crypto') || id.includes('bn.js')) {
              return 'blockchain-vendor'
            }
            
            // Firebase - separate to avoid circular dependencies
            if (id.includes('firebase')) {
              return 'firebase-vendor'
            }
            
            // HTTP clients
            if (id.includes('axios')) {
              return 'http-vendor'
            }
            
            // React ecosystem (but carefully to avoid circular deps)
            if (id.includes('react') && !id.includes('react-i18next') && !id.includes('react-icons')) {
              return 'react-vendor'
            }
            
            // Stripe
            if (id.includes('@stripe')) {
              return 'stripe-vendor'
            }
            
            // Animation
            if (id.includes('gsap')) {
              return 'animation-vendor'
            }
            
            // i18n
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n-vendor'
            }
            
            // Charts
            if (id.includes('recharts')) {
              return 'charts-vendor'
            }
            
            // Everything else goes to vendor, but this should be avoided
            // by better separation above
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
    // Source maps for production debugging
    sourcemap: 'hidden',
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
      'recharts',
    ],
    // IMPORTANT: Exclude blockchain libraries to prevent circular dependencies and Buffer conflicts
    exclude: [
      '@walletconnect',
      'ethers',
      '@solana/web3.js',
      'web3',
      'buffer',
      'safe-buffer'
    ],
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
