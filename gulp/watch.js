'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {

    //gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);

//    gulp.watch([
//        path.join(conf.paths.src, '/app/**/*.css'),
//        path.join(conf.paths.src, '/app/**/*.scss')
//    ], function(event) {
//        if(isOnlyChange(event)) {
//            gulp.start('styles-reload');
//        //} else {
//          //  gulp.start('inject-reload');
//        }
//    });

//    gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function(event) {
//        if(isOnlyChange(event)) {
//            //gulp.start('scripts-reload');
//            gulp.start('bundle');
//        } else {
//            gulp.start('inject-reload');
//        }
//    });

//    gulp.watch([
//        path.join(conf.paths.src, '/app/**/*.html'),
//        path.join(conf.paths.src, '/*.hbs'),
//        '!' + path.join(conf.paths.src, '/*.html'),
//    ], function(event) {
//        //        gulp.start('lint-html');
//        gulp.start('bundle');
//        browserSync.reload(event.path);
//    });
});
