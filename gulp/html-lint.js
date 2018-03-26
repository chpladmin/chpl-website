'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var htmlhint = require("gulp-htmlhint");

gulp.task('lint-html', function() {
    return lintHtml();
});

var customRules = [];

var lintHtml = function () {
    return gulp.src([
        path.join(conf.paths.src, '/app/**/*.html')
    ])
        .pipe(htmlhint('.htmlhintrc', customRules))
        .pipe(htmlhint.reporter('htmlhint-stylish'));
};
