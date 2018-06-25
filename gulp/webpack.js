const gulp = require('gulp');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackConfig = require('../webpack.config');

gulp.task('bundle', function() {
    const config = webpackMerge(webpackConfig(), { watch: true });
    return new Promise(resolve => {
        webpack(config, resolve);
    });
});

gulp.task('bundle:prod', function() {
    const config = webpackConfig();
    return new Promise(resolve => {
        webpack(config, resolve);
    });
});
