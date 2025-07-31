import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        global: 'globalThis'
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        // Output as a library that can be embedded
        lib: {
          entry: path.resolve(__dirname, 'simple-embed.tsx'),
          name: 'SimpleStickerEditor',
          formats: ['umd'],
          fileName: (format) => `simple-sticker-editor.${format}.js`
        },
        rollupOptions: {
          // Don't externalize for now to avoid dependency issues
          external: [],
          output: {
            globals: {},
            // Add process polyfill for browser
            intro: 'const process = { env: { NODE_ENV: "production" } };'
          }
        }
      }
    };
});
