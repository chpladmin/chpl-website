'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const base = require('./webpack.config.js');

module.exports = merge(base, {
    mode: 'production',
    optimization: {
        splitChunks: {
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            DEVELOPER_MODE: false,
            ENABLE_LOGGING: false,
            MINUTES_UNTIL_IDLE: 20,
            MINUTES_BETWEEN_KEEPALIVE: 1,
        }),
    ],
});
