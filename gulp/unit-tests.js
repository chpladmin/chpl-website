'use strict';

var path = require('path');
var gulp = require('gulp');
const gutil = require('gulp-util');
var conf = require('./conf');

var Server = require('karma').Server;

//var pathSrcJs = [
//    path.join(conf.paths.src, '/**/!(*.spec|cap*|certid*|st*|swagger*|ngCytoscape*).js')
//];

function runTests (singleRun, done) {
    //var reporters = ['mocha', 'junit', 'html', 'coverage-istanbul'];
    var reporters = ['mocha', 'junit', 'html'];
    if (!singleRun) { reporters.push('super-dots'); }

//    var preprocessors = {};
//    pathSrcJs.forEach(function(path) {
//        preprocessors[path] = ['coverage'];
//    });

    var localConfig = {
        configFile: path.join(__dirname, './../karma.conf.js'),
        singleRun: singleRun,
        autoWatch: !singleRun,
        autoWatchBatchDelay: 1000,
        reportSlowerThan: 300,
        reporters: reporters,
        //preprocessors: preprocessors,
        /*
        coverageIstanbulReporter: {
            reports: [ 'text-summary' ],
            fixWebpackSourcePaths: true,
        },
         */
        /*
        coverageReporter: {
            dir: 'test_reports/coverage',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ]
        },
         */
        htmlReporter: {
            groupSuites: true,
            outputFile: 'test_reports/units.html',
            useCompactStyle: true
        },
        junitReporter: {
            outputDir: 'test_reports',
            suite: 'unit'
        },
        mochaReporter: {
            output: singleRun ? 'full' : 'minimal',
            divider: '',
            symbols: {
                success: '+',
                info: 'i',
                warning: '!',
                error: 'x'
            }
        },
        superDotsReporter: {
            nbDotsPerLine: 100,
            color: {
                success: 'green',
                failure: 'red',
                ignore: 'yellow'
            },
            icon: {
                success : '.',
                failure : 'x',
                ignore  : '?'
            }
        }
    };

    var server = new Server(localConfig, function(err) {
        if (err === 0) {
            done();
        } else {
            done(new gutil.PluginError('karma', {
                message: 'Karma Tests failed with error: ' + err
            }));
       }
        //done();
        //process.exit(failCount);
        //done(failCount ? new Error("Failed " + failCount + " tests.") : failCount);
    })
    server.start();
}

gulp.task('test', ['scripts'], function(done) {
    runTests(true, done);
})

gulp.task('test:auto', ['watch'], function(done) {
    runTests(false, done);
});
