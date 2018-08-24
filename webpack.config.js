'use strict';

const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelPluginAngularjsAnnotate = require('babel-plugin-angularjs-annotate');
const StyleLintPlugin = require('stylelint-webpack-plugin');

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
            enforce: 'post',
            test: /\.js/,
            exclude: [
                    /specs\.js/,
                    /\.spec\.js/,
                    /node_modules/,
                    /lib/,
                    /\.mock\.js/,
            ],
            use: {
                loader: 'istanbul-instrumenter-loader',
                options: { esModules: true },
            },
        },{
            test: /\.js$/,
            exclude: [
                    /node_modules/,
                    /\.mock\.js/,
            ],
            use: [{
                loader: 'babel-loader',
                options: {
                    plugins: [BabelPluginAngularjsAnnotate],
                    presets: ['@babel/preset-env']
                }
            },{
                loader: 'eslint-loader',
                options: {
                    formatter: require('eslint-formatter-friendly'),
                    outputReport: {
                        filePath: '../test_reports/checkstyle-[hash].xml',
                        formatter: require('eslint/lib/formatters/checkstyle')
                    },
                    outputReport: {
                        filePath: '../test_reports/checkstyle-[hash].html',
                        formatter: require('eslint/lib/formatters/html'),
                    },
                }
            }],
        },{
            test: /\.html$/,
            use: [
                'html-loader',
            ],
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
            filename: 'index.html',
            hash: true,
            inject: 'body',
            template: path.resolve(__dirname, './src/index.html'),
        }),
        new HtmlWebpackPlugin({
            chunks: ['app', 'vendor'],
            filename: 'error.html',
            hash: true,
            inject: 'body',
            template: path.resolve(__dirname, './src/error.html'),
        }),
        new HtmlWebpackPlugin({
            chunks: ['app', 'vendor'],
            filename: 'style.html',
            hash: true,
            inject: 'body',
            template: path.resolve(__dirname, './src/style.html'),
        }),
        new webpack.DefinePlugin({
            DEVELOPER_MODE: true,
            ENABLE_LOGGING: true,
            MINUTES_UNTIL_IDLE: 120,
            MINUTES_BETWEEN_KEEPALIVE: 1,
        }),
        new StyleLintPlugin(),
        new CleanWebpackPlugin(['dist']),
    ]
};
