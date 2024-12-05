export default {
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!your-module-to-transform).+\\.js$',
    ],
};
