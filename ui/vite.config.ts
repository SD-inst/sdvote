import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './',
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
            },
            '/config': {
                target: 'http://127.0.0.1:8000',
            },
            '/results': {
                target: 'http://127.0.0.1:8000',
            },
        },
    },
});
