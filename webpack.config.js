const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(env = {}) {
    const plugins = [];
    const isProd = !!env.prod;

    plugins.push(
        new HtmlWebpackPlugin({
            chunks: ['app'],
            filename: './index.html',
            hash: true,
            inject: 'body',
            template: './src/index.hbs',
        })
    );

    return {
        context: path.resolve(__dirname, '.'),
        devServer: {
            port: 3000,
            proxy: {
                '/rest': {
                    target: 'http://localhost:8181/chpl-service',
                    pathRewrite: {'^/rest': ''},
                },
            },
        },
        devtool: isProd ? 'source-map' : 'eval-source-map',
        entry: {
            app: './src/app/index.js',
            // other entries
        },
        module: {
            rules: [{
                test: /\.js$/, // does the file end with '.js' ?
                use: 'babel-loader', // then use babel loader
                exclude: /node_modules/, // unless it's in node_modules
            },{
                test: /\.hbs$/,
                use: 'handlebars-loader',
            },{
                test: /\.html$/,
                use: 'html-loader',
            },{
                test: /\.png$/,
                use: [ 'url-loader?mimetype=image/png' ],
            },{
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                },{
                    loader: 'css-loader', // translates CSS into CommonJS modules
                },{
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                },{
                    loader: 'sass-loader' // compiles Sass to CSS
                }],
            },{
                test: /\.(css)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                },{
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }],
            }],
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: plugins,
    };
};
