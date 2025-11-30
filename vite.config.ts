import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ isSsrBuild }) => ({
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
    build: {
        rollupOptions: {
            output: isSsrBuild
                ? {}
                : {
                      manualChunks: {
                          'vendor-react': [
                              'react',
                              'react-dom',
                              'react-dom/client',
                          ],
                          'vendor-inertia': ['@inertiajs/react'],
                          'vendor-radix': [
                              '@radix-ui/react-accordion',
                              '@radix-ui/react-alert-dialog',
                              '@radix-ui/react-checkbox',
                              '@radix-ui/react-dialog',
                              '@radix-ui/react-dropdown-menu',
                              '@radix-ui/react-label',
                              '@radix-ui/react-popover',
                              '@radix-ui/react-progress',
                              '@radix-ui/react-select',
                              '@radix-ui/react-separator',
                              '@radix-ui/react-slot',
                              '@radix-ui/react-switch',
                              '@radix-ui/react-tabs',
                              '@radix-ui/react-tooltip',
                          ],
                          'vendor-charts': ['recharts'],
                          'vendor-date': ['date-fns'],
                      },
                  },
        },
    },
}));
