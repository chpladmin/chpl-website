'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'uglify-save-license', 'del']
});

gulp.task('clean', function () {
    return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('html', ['inject'], function () {
    var htmlFilter = $.filter('*.html', { restore: true });
    var jsFilter = $.filter('**/*.js', { restore: true });
    var cssFilter = $.filter('**/*.css', { restore: true });

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe($.useref())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

gulp.task('build', ['html', 'bundle:prod']);
