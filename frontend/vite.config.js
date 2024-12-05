import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: ['@fortawesome/react-fontawesome'],
    },
    server: {
        https: false, // Disable HTTPS for local dev server
    },
    build: {
        sourcemap: true,
    },
});
