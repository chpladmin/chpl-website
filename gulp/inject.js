'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var argv = require('yargs').argv;

var browserSync = require('browser-sync');
var environment = argv.env || 'local';

gulp.task('inject', [], function () {

    var htmlFiles = [path.join(conf.paths.src, '/*.html')];
    if (environment !== 'local') {
        htmlFiles.push('!**/style.html');
    }
    return gulp.src(htmlFiles)
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
