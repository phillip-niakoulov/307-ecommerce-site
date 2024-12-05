export default {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
    ],
    plugins: [
        'babel-plugin-transform-vite-meta-env',
        '@babel/plugin-transform-runtime',
    ],
};
