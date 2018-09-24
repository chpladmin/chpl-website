'use strict';

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const base = require('./webpack.config.js');

module.exports = merge(base, {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            DEVELOPER_MODE: true,
            ENABLE_LOGGING: true,
            MINUTES_UNTIL_IDLE: 120,
            MINUTES_BETWEEN_KEEPALIVE: 1,
        }),
    ]
});
