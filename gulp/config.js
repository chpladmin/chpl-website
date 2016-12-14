var concat = require('gulp-concat'),
    es = require('event-stream'),
    gulp = require('gulp'),
    ngConstant = require('gulp-ng-constant'),
    argv = require('yargs').argv;

var enviroment = argv.env || 'local';

gulp.task('config', function () {
    var config = gulp.src('config/' + enviroment + '.json')
        .pipe(ngConstant({
            name: 'chpl.constants',
            space: ' ',
            wrap: "(function() {\n    'use strict';\n\n<%= __ngModule %>\n})();"
        }));
    var scripts = gulp.src('js/*');
    return es.merge(config, scripts)
        .pipe(concat('index.constants.js'))
        .pipe(gulp.dest('src/app'))
        .on('error', function() { });
});
