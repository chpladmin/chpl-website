'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var argv = require('yargs').argv;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');
var environment = argv.env || 'local';

gulp.task('inject-reload', ['inject'], function() {
    browserSync.reload();
});

gulp.task('inject', [], function () {
//    var injectStyles = gulp.src([
//        path.join(conf.paths.tmp, '/serve/app/**/*.css'),
//        path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
//    ], { read: false });

//    var injectScripts = gulp.src([
//        path.join(conf.paths.src, '/app/**/*.module.js'),
//        path.join(conf.paths.src, '/app/**/*.js'),
//        path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
//        path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
//    ])
//        .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

//    var injectOptions = {
//        ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
//        addRootSlash: false
//    };

    var htmlFiles = [path.join(conf.paths.src, '/*.html')];
    if (environment !== 'local') {
        htmlFiles.push('!**/style.html');
    }
    return gulp.src(htmlFiles)
//        .pipe($.inject(injectStyles, injectOptions))
  //      .pipe($.inject(injectScripts, injectOptions))
//        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
