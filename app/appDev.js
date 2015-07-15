;(function () {
    'use strict';

    // Declare app level module which depends on views, and components
    angular.module('appDev', ['app', 'ngMockE2E'])
        .run(function ($httpBackend) {
            var data;
            data = [{name: 'One'}, {name: 'Two'}];
            $httpBackend.whenGET('/data').respond(200, {message: "Hello world"});
            $httpBackend.whenGET(/^nav\/.*/).passThrough();
            $httpBackend.whenGET(/^search\/.*/).passThrough();
            $httpBackend.whenGET(/herokuapp/).passThrough();
            $httpBackend.whenGET(/^view.\/.*/).passThrough();
        })
        .config(function ($provide) {
            $provide.decorator('$exceptionHandler', ['$delegate', function($delegate) {
                return function (exception, cause) {
                    $delegate(exception, cause);
                    //alert(exception.message);
                };
            }])
        });
})();
