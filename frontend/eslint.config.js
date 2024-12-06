import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginCypress from 'eslint-plugin-cypress'; // Import the Cypress plugin

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,vue}'] },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...pluginCypress.configs.recommended.globals, // Add Cypress globals
            },
        },
    },
    pluginJs.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    pluginCypress.configs.recommended, // Add Cypress recommended config
];
