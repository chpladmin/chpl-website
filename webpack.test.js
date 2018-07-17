const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    //    entry: {}, //'./src/app/specs.js',
//    module: {
//        rules: [{
//            enforce: 'post',
//            test: /\.js/,
//            exclude: /(\.spec\.js|node_modules)/,
//            loader: 'istanbul-instrumenter-loader',
//        }],
//    }
});
