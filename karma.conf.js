module.exports = function(config){
    config.set({

        basePath : './',

        files : [
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-animate/angular-animate.min.js',
            'app/bower_components/ngstorage/ngStorage.min.js',
            'app/bower_components/jquery/dist/jquery.min.js',
            'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
            'app/bower_components/angular-smart-table/dist/smart-table.min.js',
            'app/bower_components/angular-loading-bar/build/loading-bar.min.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/ngstorage/ngStorage.js',
            'app/bower_components/jquery/dist/jquery.min.js',
            'app/bower_components/angular-smart-table/dist/smart-table.min.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'app/app.js',
            'app/appDev.js',
            'app/**/*Module.js',
            'app/components/**/*.js',
            'app/common/**/*.js',
            'app/compare/**/*.js',
            'app/login/**/*.js',
            'app/nav/**/*.js',
            'app/product/**/*.js',
            'app/search/**/*.js',
            'app/view*/**/*.js'
        ],

        preprocessors: {
            'app/common/**/!(*test).js': ['coverage'],
            'app/compare/**/!(*test).js': ['coverage'],
            'app/login/**/!(*test).js': ['coverage'],
            'app/nav/**/!(*test).js': ['coverage'],
            'app/product/**/!(*test).js': ['coverage'],
            'app/search/**/!(*test).js': ['coverage'],
            'app/app.js': ['coverage']
        },

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['PhantomJS'],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-phantomjs-launcher',
            'karma-coverage'
        ],

        reporters : ['dots', 'junit', 'progress', 'coverage'],

        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/',
            subdir: '.',
            file: 'coverage.lcov'
        },

        junitReporter : {
            outputDir: 'test_reports',
            suite: 'unit'
        }

    });
};
