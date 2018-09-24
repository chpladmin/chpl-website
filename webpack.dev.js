'use strict';

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const base = require('./webpack.ci.js');

module.exports = merge(base, {
    devServer: {
        port: 3000,
        proxy: {
            '/rest': {
                target: 'http://localhost:8181/chpl-service',
                pathRewrite: {'^/rest' : ''},
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'style.html',
            hash: true,
            inject: 'body',
            template: path.resolve(__dirname, './src/style.html'),
        }),
        new webpack.DefinePlugin({
            DEVELOPER_MODE: true,
            ENABLE_LOGGING: true,
            MINUTES_UNTIL_IDLE: 120,
            MINUTES_BETWEEN_KEEPALIVE: 1,
        }),
    ]
});
