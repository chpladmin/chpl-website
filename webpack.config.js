const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelPluginAngularjsAnnotate = require('babel-plugin-angularjs-annotate');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env) => {
  if (!env) {
    env = {};
  }
  if (!env.NODE_ENV) {
    env.NODE_ENV = 'development'; // default to development if not provided
  }
  const config = {
    mode: env.NODE_ENV,
    resolve: {
      modules: ['src/app', 'node_modules'],
    },
    entry: {
      app: path.resolve(__dirname, './src/app/index.js'),
      administration: path.resolve(__dirname, './src/app/pages/administration/index.js'),
      charts: path.resolve(__dirname, './src/app/pages/charts/index.js'),
      collections: path.resolve(__dirname, './src/app/pages/collections/index.js'),
      compare: path.resolve(__dirname, './src/app/pages/compare/index.js'),
      listing: path.resolve(__dirname, './src/app/pages/listing/index.js'),
      navigation: path.resolve(__dirname, './src/app/navigation/index.js'),
      organizations: path.resolve(__dirname, './src/app/pages/organizations/index.js'),
      registration: path.resolve(__dirname, './src/app/pages/registration/index.js'),
      reports: path.resolve(__dirname, './src/app/pages/reports/index.js'),
      subscriptions: path.resolve(__dirname, './src/app/pages/subscriptions/index.js'),
      templates: path.resolve(__dirname, './src/app/templates.js'),
    },
    module: {
      rules: [{
        enforce: 'post',
        test: /\.js$/,
        exclude: [
          /specs\.js/,
          /\.spec\.js/,
          /\.test\.jsx/,
          /node_modules/,
          /lib/,
          /\.mock\.js/,
        ],
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true },
        },
      }, {
        test: /\.(js|jsx)$/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        exclude: [
          /node_modules/,
          /\.mock\.js/,
        ],
        use: [{
          loader: 'babel-loader',
          options: {
            plugins: [BabelPluginAngularjsAnnotate],
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        }],
      }, {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [
          { loader: 'html-loader' },
          { loader: 'htmllint-loader' },
        ],
      }, {
        test: /\.png$/,
        use: ['url-loader?mimetype=image/png'],
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader?limit=10000&mimetype=application/font-woff',
          options: {
            name: '[path][name].[ext]',
          },
        },
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader?limit=10000&mimetype=application/font-woff',
          options: {
            name: '[path][name].[ext]',
          },
        },
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
          options: {
            name: '[path][name].[ext]',
          },
        },
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
          options: {
            name: '[path][name].[ext]',
          },
        },
      }, {
        test: /\.(s*)css$/, /// \.scss$/,
        use: [{
          loader: 'style-loader', // inject CSS to page
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'postcss-loader', // Run post css actions
          options: {
            plugins() { // post css plugins, can be exported to postcss.config.js
              return [
                require('postcss-import'),
                require('precss'),
                require('autoprefixer'),
              ];
            },
            sourceMap: true,
          },
        }, {
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
    ],
  };

  config.plugins.push(
    new webpack.DefinePlugin({
      DEVELOPER_MODE: JSON.stringify(env.NODE_ENV === 'development'),
      ENABLE_LOGGING: JSON.stringify(env.NODE_ENV === 'development'),
      MINUTES_UNTIL_IDLE: env.NODE_ENV === 'development' ? 150 : 50,
      MINUTES_UNTIL_LOGOUT: env.NODE_ENV === 'development' ? 150 : 5,
      MINUTES_BETWEEN_KEEPALIVE: 1,
    }),
  );

  if (env.NODE_ENV === 'production') {
    config.optimization = {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    };
    config.plugins.push(new CleanWebpackPlugin(['dist']));
    config.plugins.push(new webpack.HashedModuleIdsPlugin());
  }
  if (env.NODE_ENV === 'development') {
    config.devtool = 'inline-source-map';
  }
  if (env.server) {
    config.devServer = {
      clientLogLevel: 'silent',
      disableHostCheck: true,
      port: 3000,
      proxy: {
        '/rest': {
          target: env.useDev ? 'https://chpl-dev.healthit.gov/rest' : 'http://localhost:8181/chpl-service',
          changeOrigin: env.useDev,
          pathRewrite: { '^/rest': '' },
        },
      },
    };
  }
  return config;
};
