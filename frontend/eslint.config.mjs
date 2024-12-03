import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                // Don't need 'browser', 'es2021', or 'jest' because included with globals.browser
            },
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
            },
        },
        rules: {
            'react/prop-types': 0,
            'react/react-in-jsx-scope': 'off',
        },
        settings: {
            react: {
                version: '18.3.1',
            },
        },
        env: {
            'cypress/globals': true,
        },
        plugins: ['cypress'],
        extends: ['eslint:recommended', 'plugin:cypress/recommended'],
    },
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
];
