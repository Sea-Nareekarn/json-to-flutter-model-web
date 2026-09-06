import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/json-to-flutter-model-web/' : '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
  }
}));
