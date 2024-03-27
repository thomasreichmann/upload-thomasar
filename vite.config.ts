import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig({
    plugins: [
        sveltekit(),
        {
            name: 'cookie-resolver',
            resolveId(id) {
                if (id === 'cookie') {
                    return require.resolve('./node_modules/cookie/index.js');
                }
            }
        }
    ],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    },
    build: {
        commonjsOptions: {
            include: []
        }
    }
});
