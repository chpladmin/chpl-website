'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('watch', ['inject', 'lint-styles'/*, 'lint-html'*/], function () {
    gulp.watch([
        path.join(conf.paths.src, '/app/**/*.css'),
        path.join(conf.paths.src, '/app/**/*.scss')
    ], function(event) {
        gulp.start('lint-styles');
    });

    gulp.watch([
        path.join(conf.paths.src, '/app/**/*.html'),
        path.join(conf.paths.src, '/*.hbs'),
        '!' + path.join(conf.paths.src, '/*.html'),
    ], function(event) {
        //gulp.start('lint-html');
    });
});
