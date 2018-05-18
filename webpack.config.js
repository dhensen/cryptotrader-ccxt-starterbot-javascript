const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    target: 'node',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    // externals: ['talib'],
    module: {
        rules: [
            {
                test: /\.node$/,
                loader: 'native-ext-loader',
                options: {
                    rewritePath: '/executable_dir',
                },
            },
        ],
    },
    resolve: {
        modules: ['src', 'node_modules'],
        alias: {
            talib: path.resolve(__dirname, 'src/talib.node'),
        },
    },
};
