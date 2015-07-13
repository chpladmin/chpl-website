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
            'app/app.js',
            'app/**/*Module.js',
            'app/components/**/*.js',
            'app/search/**/*.js',
            'app/view*/**/*.js',
            'app/login/**/*.js',
            'app/nav/**/*.js'
        ],

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['PhantomJS'],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-phantomjs-launcher'
        ],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};
