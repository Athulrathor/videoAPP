import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      tailwindcss(),
      react(),
      {
        name: 'configure-response-headers',
        configureServer: (server) => {
          server.middlewares.use((_req, res, next) => {
            res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
            res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
            next();
          });
        },
      },
    ],
    define: {
      // Make process.env available (if needed for compatibility)
      'process.env': JSON.stringify(env)
    }
  }
})