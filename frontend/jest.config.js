// jest.config.js
export default {
    transform: {
        '^.+\\.jsx?$': 'babel-jest', // Use babel-jest for transforming JS/JSX files
        '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for transforming TS/TSX files
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
    testEnvironment: 'jsdom', // Use jsdom for testing browser-like environments
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS and SCSS imports
    },
    transformIgnorePatterns: [
        '/node_modules/(?!your-module-to-transform).+\\.js$', // Adjust this pattern as needed
    ],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'], // Include file extensions for modules
    extensionsToTreatAsEsm: ['.js', '.jsx', '.ts', '.tsx', '.json', '.node'],
};
