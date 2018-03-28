'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var htmllint = require('gulp-htmllint'),
    fancyLog = require('fancy-log'),
    colors = require('ansi-colors');

gulp.task('lint-html', function() {
    return lintHtml();
});

var rules = {
//    "attr-name-ignore-regex": "{{.*?}}",
    "attr-no-dup": true,
    "class-no-dup": true,
//    "id-class-ignore-regex": "{{.*?}}",
    "id-class-style": 'dash',
    "id-no-dup": true,
    "img-req-alt": true,
    "indent-style": 'spaces',
    "indent-width": 2,
    "indent-width-cont": true,
    "input-req-label": true,
    "line-no-trailing-whitespace": true,
//    "raw-ignore-regex": "{{.*?}}",
    "spec-char-escape": false,
    "table-req-header": true,
    "tag-bans": ['style', 'b'],
    "tag-name-lowercase": true,
    "tag-name-match": true,
//    "text-ignore-regex": "{{.*?}}",
};

var lintHtml = function () {
    return gulp.src([
        path.join(conf.paths.src, '/app/**/*.html')
    ])
        .pipe(htmllint({rules: rules}, htmllintReporter));
};

function htmllintReporter(filepath, issues) {
    if (issues.length > 0) {
        filepath = filepath.replace(/^.*app/,'');
        issues.forEach(function (issue) {
            fancyLog(colors.cyan('[gulp-htmllint] ') + colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + colors.red('(' + issue.rule + ') ' + issue.msg));
        });
        process.exitCode = 1;
    }
}
