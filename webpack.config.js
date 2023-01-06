const NodemonPlugin = require('nodemon-webpack-plugin'); // Ding
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
module.exports = {
    mode: 'development',
    entry: './src/frontend/index.ts',
    output: {
        path: path.resolve('./dist'),
        filename: 'index.js',
    },
    plugins: [
        new NodemonPlugin(),
        new CopyPlugin({
            patterns: [
                { from: path.resolve('./assets'), to: path.resolve('./dist/assets'), force: true },
            ],
        }),
    ],
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }, ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};