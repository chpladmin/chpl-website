'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var protractorReport = require('gulp-protractor-cucumber-html-report');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor (done) {
    var params = process.argv;
    var args = params.length > 3 ? [params[3], params[4]] : [];

    //gulp.src(path.join(conf.paths.e2e, '/**/*.js')) // use this for Jasmine e2e tests
    gulp.src(path.join(conf.paths.features, '/**/*.feature'))
        .pipe($.protractor.protractor({
            configFile: 'protractor.conf.js',
            args: args
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            buildReport();
            //throw err;
        })
        .on('end', function () {
            // Close browser sync server
            browserSync.exit();
            buildReport();
            done();
        });
}

function buildReport (failing, err) {
    return gulp.src('test_reports/cucumber_report.json')
        .pipe(protractorReport({
            dest: 'test_reports/',
            filename: 'cucumber_report.html'
        }));
}

gulp.task('protractor', ['protractor:src']);
gulp.task('protractor:src', ['serve:e2e', 'webdriver-update'], runProtractor);
gulp.task('protractor:dist', ['serve:e2e-dist', 'webdriver-update'], runProtractor);
gulp.task('protractor:report', buildReport);
