const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const path = require('path');
module.exports = {
    mode: 'development',
    entry: './src/frontend/index.ts',
    output: {
        path: path.resolve('./dist'),
        filename: 'index.js',
    },
    plugins: [
        new Dotenv(),
        new NodemonPlugin(
            {
                watch: path.resolve('src'),
            }
        ),
        new CopyPlugin({
            patterns: [
                { from: path.resolve('./assets'), to: path.resolve('./dist/assets'), force: true },
                { from: path.resolve('./views/index.html'), to: path.resolve('./dist/index.html'), force: true },
                { from: path.resolve('./views/index.css'), to: path.resolve('./dist/index.css'), force: true },
            ],
        })
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
