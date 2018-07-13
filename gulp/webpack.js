'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackConfig = require('../webpack.config');

gulp.task('bundle', function() {
    const config = webpackMerge(webpackConfig(), { watch: true });
    return webpack(config, function(err, stats) {
	if(err) throw new gutil.PluginError('webpack', err);
	gutil.log('[webpack]', stats.toString({
	    // output options
	}));
    });
});

gulp.task('bundle:prod', function() {
    const config = webpackMerge(webpackConfig({ prod: true }), { watch: true });
    return webpack(config, function(err, stats) {
	if(err) throw new gutil.PluginError('webpack', err);
	gutil.log('[webpack]', stats.toString({
	    // output options
	}));
    });
});
