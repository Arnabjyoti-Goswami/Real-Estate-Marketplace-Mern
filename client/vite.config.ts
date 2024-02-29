import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { ValidateEnv } from '@julr/vite-plugin-validate-env';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: './',
  envPrefix: 'VITE_',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react(), ValidateEnv()],
});
