'use strict';

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelPluginAngularjsAnnotate = require('babel-plugin-angularjs-annotate');

module.exports = {
    devServer: {
        port: 3000,
        proxy: {
            '/rest': {
                target: 'http://localhost:8181/chpl-service',
                pathRewrite: {'^/rest' : ''},
            },
        },
    },
    entry: {
        app: path.resolve(__dirname, './src/app/index.js'),
        vendor: ['angular'],
    },
    mode: 'development',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: [BabelPluginAngularjsAnnotate],
                    presets: ['@babel/preset-env']
                }
            }
        },{
            //            test: /\.hbs$/,
            //            use: 'handlebars-loader',
            //        },{
            test: /\.html$/,
            use: 'html-loader',
        },{
            test: /\.png$/,
            use: [ 'url-loader?mimetype=image/png' ],
        },{
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            use: {
                loader: "url-loader?limit=10000&mimetype=application/font-woff",
                options: {
                    name: '[path][name].[ext]',
                },
            },
        },{
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            use: {
                loader: "url-loader?limit=10000&mimetype=application/font-woff",
                options: {
                    name: '[path][name].[ext]',
                },
            },
        },{
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            use: {
                loader: "url-loader?limit=10000&mimetype=application/octet-stream",
                options: {
                    name: '[path][name].[ext]',
                },
            },
        },{
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            use: {
                loader: "file-loader",
                options: {
                    name: '[path][name].[ext]',
                },
            },
        },{
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: {
                loader: "url-loader?limit=10000&mimetype=image/svg+xml",
                options: {
                    name: '[path][name].[ext]',
                },
            },
        },{
            test: /\.(s*)css$/, ///\.scss$/,
            use: [{
                loader: 'style-loader', // inject CSS to page
                options: {
                    sourceMap: true,
                },
            },{
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                },
            },{
                loader: 'postcss-loader', // Run post css actions
                options: {
                    plugins: function () { // post css plugins, can be exported to postcss.config.js
                        return [
                            require('postcss-import'),
                            require('precss'),
                            require('autoprefixer'),
                        ];
                    },
                    sourceMap: true,
                }
            },{
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                },
            }],
        }],
    },
    optimization: {
        splitChunks: {
            name: true,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['app', 'vendor'],
            hash: true,
            inject: 'body',
            template: path.resolve(__dirname, './src/index.html'),
        }),
        new webpack.DefinePlugin({
            DEVELOPER_MODE: true,
            ENABLE_LOGGING: true,
            MINUTES_UNTIL_IDLE: '120',
        }),
    ]
};
