'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackDev = require('../webpack.dev');
const webpackProd = require('../webpack.prod');

gulp.task('bundle', function() {
    return webpack(webpackDev, function(err, stats) {
	if(err) throw new gutil.PluginError('webpack', err);
	gutil.log('[webpack]', stats.toString({
	    // output options
	}));
    });
});

gulp.task('bundle:prod', function() {
    return webpack(webpackProd, function(err, stats) {
	if(err) throw new gutil.PluginError('webpack', err);
	gutil.log('[webpack]', stats.toString({
	    // output options
	}));
    });
});
