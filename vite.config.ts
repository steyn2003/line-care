import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            '@/routes/appearance': resolve(
                __dirname,
                'resources/js/routes/appearance/index.ts',
            ),
            '@/routes/login': resolve(
                __dirname,
                'resources/js/routes/login/index.ts',
            ),
            '@/routes/password/confirm': resolve(
                __dirname,
                'resources/js/routes/password/confirm/index.ts',
            ),
            '@/routes/password': resolve(
                __dirname,
                'resources/js/routes/password/index.ts',
            ),
            '@/routes/profile': resolve(
                __dirname,
                'resources/js/routes/profile/index.ts',
            ),
            '@/routes/register': resolve(
                __dirname,
                'resources/js/routes/register/index.ts',
            ),
            '@/routes/two-factor/login': resolve(
                __dirname,
                'resources/js/routes/two-factor/login/index.ts',
            ),
            '@/routes/two-factor': resolve(
                __dirname,
                'resources/js/routes/two-factor/index.ts',
            ),
            '@/routes/user-password': resolve(
                __dirname,
                'resources/js/routes/user-password/index.ts',
            ),
            '@/routes/verification': resolve(
                __dirname,
                'resources/js/routes/verification/index.ts',
            ),
            '@/routes': resolve(__dirname, 'resources/js/routes/index.ts'),
            '@': resolve(__dirname, 'resources/js'),
        },
        extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
