'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const base = require('./webpack.config.js');

module.exports = merge(base, {
    mode: 'production',
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            DEVELOPER_MODE: false,
            ENABLE_LOGGING: false,
            MINUTES_UNTIL_IDLE: 50,
            MINUTES_BETWEEN_KEEPALIVE: 1,
            UAT_MODE: false,
        }),
        new webpack.HashedModuleIdsPlugin(),
    ],
});
