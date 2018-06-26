'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {

//    gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);

//    gulp.watch([
//        path.join(conf.paths.src, '/app/**/*.css'),
//        path.join(conf.paths.src, '/app/**/*.scss')
//    ], function(event) {
//        if(isOnlyChange(event)) {
//            gulp.start('styles-reload');
//        } else {
//            gulp.start('inject-reload');
//        }
//    });

//    gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function(event) {
//        if(isOnlyChange(event)) {
//            gulp.start('scripts-reload');
//        } else {
//            gulp.start('inject-reload');
//        }
//    });

//    var htmlFiles = [path.join(conf.paths.src, '/app/**/*.html')];
//    htmlFiles.push('!/app/**/index.html');

//    gulp.watch(htmlFiles, function(event) {
        //        gulp.start('lint-html');
//        browserSync.reload(event.path);
//    });
});
