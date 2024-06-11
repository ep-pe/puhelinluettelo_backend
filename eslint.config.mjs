import globals from 'globals'
import pluginJs from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'


export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    { languageOptions: { globals: globals.node, sourceType: 'module', ecmaVersion: 'latest' } },
    { ignores: ['dist/'] },
    { plugins: { '@stylistic/js': stylisticJs } },
    {
        rules: {
            '@stylistic/js/indent': [
                'error',
                4
            ],
            '@stylistic/js/linebreak-style': [
                'error',
                'windows'
            ],
            '@stylistic/js/quotes': [
                'error',
                'single'
            ],
            '@stylistic/js/semi': [
                'error',
                'never'
            ],
            'eqeqeq': 'error',
            'no-trailing-spaces': 'error',
            'object-curly-spacing': [
                'error', 'always'
            ],
            'arrow-spacing': [
                'error', { 'before': true, 'after': true }
            ],
            'no-console': 0
        }
    },
    pluginJs.configs.recommended,
]