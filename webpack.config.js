const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    target: 'node',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
};
