'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');

const base = require('./webpack.config.js');

module.exports = merge(base, {
    mode: 'production',
    devServer: {
        disableHostCheck: true,
        port: 3000,
        proxy: {
            '/rest': {
                target: 'http://localhost:8181/chpl-service',
                pathRewrite: {'^/rest' : ''},
            },
        },
    },
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
        new webpack.DefinePlugin({
            DEVELOPER_MODE: JSON.stringify(false),
            ENABLE_LOGGING: JSON.stringify(true),
            FEATURE_FLAGS: JSON.stringify(require('./flags.prod.json')),
            MINUTES_UNTIL_IDLE: 150,
            MINUTES_BETWEEN_KEEPALIVE: 1,
            UAT_MODE: JSON.stringify(false),
        }),
        new webpack.HashedModuleIdsPlugin(),
    ],
});
