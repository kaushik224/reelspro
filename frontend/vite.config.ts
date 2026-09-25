import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        // Removed withCredentials: true from here
        configure: (proxy) => { //  Removed unused 'options' parameter
          // Pass credentials/cookies upstream if needed
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('withCredentials', 'true');
          });

          // Clean up response cookies for localhost
          proxy.on('proxyRes', (proxyRes) => {
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              proxyRes.headers['set-cookie'] = cookies.map(cookie => {
                return cookie
                  .replace(/; Secure/i, '')
                  .replace(/; SameSite=Strict/i, '; SameSite=Lax')
                  .replace(/Domain=\.?localhost/i, '');
              });
            }
          });
        },
      },
    },
  },
});
