const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    entry: path.resolve(__dirname, './src/app/specs.js'),
    //{
//        specs: path.resolve(__dirname, './src/app/specs.js'),
        //app: './src/app/specs.js',
//    },
    module: {
        rules: [{
            enforce: 'post',
            test: /\.js/,
            exclude: [
                    /specs\.js/,
                    /\.spec\.js/,
                    /node_modules/,
            ],
            use: {
                loader: 'istanbul-instrumenter-loader',
                options: { esModules: true },
            },
        }],
    },
});
