const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelPluginAngularjsAnnotate = require('babel-plugin-angularjs-annotate');

const plugins = [
    //new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
        chunks: ['app', 'vendor'],
        filename: path.resolve(__dirname, './src/index.html'),
        hash: true,
        inject: 'body',
        template: path.resolve(__dirname, './src/index.hbs'),
    }),
    new HtmlWebpackPlugin({
        chunks: ['app', 'vendor'],
        filename: path.resolve(__dirname, './src/error.html'),
        hash: true,
        inject: 'body',
        template: path.resolve(__dirname, './src/error.hbs'),
    }),
    new HtmlWebpackPlugin({
        chunks: ['app', 'vendor'],
        filename: path.resolve(__dirname, './src/style.html'),
        hash: true,
        inject: 'body',
        template: path.resolve(__dirname, './src/style.hbs'),
    })
];

module.exports = {
    context: path.resolve(__dirname, '.'),
    entry: {
        app: path.resolve(__dirname, './src/app/index.js'),
        vendor: ['angular'],
    },
    mode: 'development',
    module: {
        rules: [{
            test: /\.js$/, // does the file end with '.js' ?
            use: [{
                loader: 'babel-loader', // then use babel loader
                options: {
                    plugins: [BabelPluginAngularjsAnnotate],
                },
//            },{
//                loader: 'eslint-loader',
            }],
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
            cacheGroups: {
		vendor: {
		    chunks: 'all',
		    name: 'vendor',
		    test: /node_modules/,
		},
            },
        },
    },
    output: {
        filename: '[name].js',
        publicPath: './',
    },
    plugins: plugins,
};
