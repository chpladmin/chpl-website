const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    /*        devServer: {
     port: 3000,
     contentBase: '.tmp/serve'
     proxy: {
     '/rest': {
     target: 'http://localhost:8181/chpl-service',
     pathRewrite: {'^/rest': ''},
     },
     },
     },*/
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, '.tmp/serve/'),
    },
});
