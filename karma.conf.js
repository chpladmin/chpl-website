const webpackConfig = require('./webpack.config');
const webpackMerge = require('webpack-merge');
const webpackTestConfig = webpackMerge(webpackConfig({ test: true }), {
    entry: './src/app/specs.js'
});

module.exports = function(config) {
    config.set({
        files: ['src/app/specs.js'],
        preprocessors: {
            'client/specs.js': ['webpack']
        },
        plugins: [
            // ...
            'karma-webpack'
        ],
        webpack: webpackTestConfig,
        webpackServer: {
            noInfo: true
        }
        // ...
    });
};
