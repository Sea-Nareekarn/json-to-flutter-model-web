import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  const isVercel = process.env.VERCEL === '1' || process.env.NOW_BUILDER === '1';

  let basePath = '/';
  if (isGitHubActions && !isVercel) {
    basePath = '/json-to-flutter-model-web/';
  }

  return {
    plugins: [react()],
    base: basePath,
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: false,
    }
  };
});
