import { defineConfig } from 'vitest/config';
import path from 'path';
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        include: [
            '**/__test__/services/**/*.test.{ts,tsx}',
            '**/__test__/data-access/**/*.test.{ts,tsx}',
            '**/__test__/api/**/*.test.{ts,tsx}',
            '**/__test__/app/management/**/*.test.{ts,tsx}',
            '**/__test__/components/**/*.test.{ts,tsx}'
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            reportsDirectory: './coverage',
            include: [
                'services/**/*.ts',
                'data-access/**/*.ts',
                'app/api/**/*.ts',
                'app/management/**/*.tsx',
                'components/**/*.tsx',
            ],
            exclude: [
                '**/route.ts',
                '**/createQuery.ts',
                '**/*.test.ts',
                '**/types.ts',
                '**/*.type.ts',
                '**/*.module.*',
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});


const servicesTest = defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        include: ['**/__test__/services/**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            reportsDirectory: './coverage',
            include: [
                'services/**/*.ts',
                'data-access/**/*.ts',
                'lib/mongoDB/**/*.ts',
            ],
            exclude: [
                '**/*.test.ts',
                '**/types.ts',
                '**/*.type.ts',
                '**/*.module.*',
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});


