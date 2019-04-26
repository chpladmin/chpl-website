'use strict';

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelPluginAngularjsAnnotate = require('babel-plugin-angularjs-annotate');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    entry: {
        app: path.resolve(__dirname, './src/app/index.js'),
        admin: path.resolve(__dirname, './src/app/admin/index.js'),
        administration: path.resolve(__dirname, './src/app/pages/administration/index.js'),
        charts: path.resolve(__dirname, './src/app/pages/charts/index.js'),
        collections: path.resolve(__dirname, './src/app/pages/collections/index.js'),
        compare: path.resolve(__dirname, './src/app/pages/compare/index.js'),
        listing: path.resolve(__dirname, './src/app/pages/listing/index.js'),
        navigation: path.resolve(__dirname, './src/app/navigation/index.js'),
        organizations: path.resolve(__dirname, './src/app/pages/organizations/index.js'),
        product: path.resolve(__dirname, './src/app/product/index.js'),
        registration: path.resolve(__dirname, './src/app/pages/registration/index.js'),
        reports: path.resolve(__dirname, './src/app/pages/reports/index.js'),
        search: path.resolve(__dirname, './src/app/pages/search/index.js'),
        templates: path.resolve(__dirname, './src/app/templates.js'),
    },
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
            exclude: /node_modules/,
            use: [
                { loader: 'html-loader' },
                {
                    loader: 'htmllint-loader',
                    query: {
                        failOnError: false,
                        failOnWarning: false,
                    },
                },
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
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            hash: true,
            inject: 'body',
            template: path.resolve(__dirname, './src/index.html'),
        }),
        new HtmlWebpackPlugin({
            filename: 'error.html',
            hash: true,
            inject: 'body',
            template: path.resolve(__dirname, './src/error.html'),
        }),
        new HtmlWebpackPlugin({
            filename: 'unsupported-browser.html',
            hash: true,
            inject: 'body',
            template: path.resolve(__dirname, './src/unsupported-browser.html'),
        }),
        new StyleLintPlugin(),
    ]
};
