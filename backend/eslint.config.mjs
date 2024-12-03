import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                // Don't need 'browser', 'es2021', or 'jest' because included with globals.browser
            },
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
            },
            plugins: [
                'jest', // Add the Jest plugin
            ],
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
    },

    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
];
