const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env = {}) {
    const plugins = [];
    const isProd = !!env.prod;

    plugins.push(
        new HtmlWebpackPlugin({
            chunks: ['app', 'vendor'],
            filename: path.resolve(__dirname, './src/index.html'),
            hash: true,
            inject: 'body',
            template: path.resolve(__dirname, './src/index.hbs'),
        })
    );
    plugins.push(
        new HtmlWebpackPlugin({
            chunks: ['app', 'vendor'],
            filename: path.resolve(__dirname, './src/error.html'),
            hash: true,
            inject: 'body',
            template: path.resolve(__dirname, './src/error.hbs'),
        })
    );
    plugins.push(
        new HtmlWebpackPlugin({
            chunks: ['app', 'vendor'],
            filename: path.resolve(__dirname, './src/style.html'),
            hash: true,
            inject: 'body',
            template: path.resolve(__dirname, './src/style.hbs'),
        })
    );

    return {
        context: path.resolve(__dirname, '.'),
/*        devServer: {
            port: 3000,
            proxy: {
                '/rest': {
                    target: 'http://localhost:8181/chpl-service',
                    pathRewrite: {'^/rest': ''},
                },
            },
        },*/
        devtool: isProd ? 'source-map' : 'eval-source-map',
        entry: {
            app: path.resolve(__dirname, './src/app/index.js'),
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
                test: /\.css$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                },{
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }],
            }],
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
		    vendor: {
			test: /node_modules/,
			chunks: 'all',
			name: 'vendor',
		    },
                },
            },
        },
        output: {
            filename: '[name].js',
            path: isProd ? path.resolve(__dirname, 'dist/') : path.resolve(__dirname, '.tmp/serve/'),
            publicPath: './',
        },
        plugins: plugins,
    };
};
