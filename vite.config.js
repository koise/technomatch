import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: [
                'resources/js/app.js',
                'resources/css/app.css',
            ],
            refresh: true,
        }),
    ],
});
