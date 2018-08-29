'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');

const base = require('./webpack.config.js');

module.exports = merge(base, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            DEVELOPER_MODE: false,
            ENABLE_LOGGING: false,
            MINUTES_UNTIL_IDLE: 20,
            MINUTES_BETWEEN_KEEPALIVE: 1,
        }),
    ],
});
