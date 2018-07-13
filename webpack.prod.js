const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    devtool: 'source-map',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist/'),
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true,
        }),
    ],
});
