const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    devtool: 'source-map',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist/'),
    },
    plugins: [
        new webpack.DefinePlugin({
            DEVELOPER_MODE: true,
            ENABLE_LOGGING: true,
            MINUTES_UNTIL_IDLE: '20',
        }),
        new UglifyJSPlugin({
            sourceMap: true,
        }),
    ],
});
