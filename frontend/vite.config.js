import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple HTML polyfill injection
const bufferPolyfillPlugin = () => {
  return {
    name: 'buffer-polyfill-html',
    transformIndexHtml(html) {
      const polyfillScript = `
  <script>
    // Initialize globals before modules load to prevent TDZ errors
    (function() {
      try {
        // Setup window/global
        if (typeof window !== 'undefined') {
          window.global = window;
          globalThis.global = globalThis;
        }
        
        // Setup Promise support FIRST (critical for async/await)
        if (typeof Promise === 'undefined') {
          console.error('Promise is not defined!');
        }
        
        // Setup process BEFORE any module code runs
        if (typeof process === 'undefined' || !process.browser) {
          globalThis.process = {
            env: { NODE_ENV: 'production' },
            browser: true
          };
          if (typeof window !== 'undefined') window.process = globalThis.process;
        }
        
        // Setup module BEFORE any CommonJS module code runs
        if (typeof module === 'undefined') {
          globalThis.module = { exports: {} };
          if (typeof window !== 'undefined') window.module = globalThis.module;
        }
      } catch (e) {
        console.error('Polyfill error:', e);
      }
    })();
  </script>`
      
      const headClose = html.indexOf('</head>')
      if (headClose === -1) {
        return html.replace('<body', polyfillScript + '\n<body')
      }
      return html.slice(0, headClose) + polyfillScript + html.slice(headClose)
    }
  }
}

export default defineConfig({
  plugins: [react(), bufferPolyfillPlugin()],
  resolve: {
    alias: [
      { find: 'buffer', replacement: '/src/shims/buffer-shim.js' },
      { find: 'process', replacement: 'process/browser' },
      { find: 'stream', replacement: 'stream-browserify' },
      { find: 'util', replacement: 'util' },
    ],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'es'
      }
    },
    chunkSizeWarningLimit: 5000,
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: true,
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'recharts',
    ],
    exclude: [
      '@walletconnect',
      'ethers',
      '@solana/web3.js',
      'web3',
      'buffer',
    ],
  },
  server: {
    port: 3000,
    open: false,
  },
  preview: {
    port: 4173,
    open: true,
  },
})
