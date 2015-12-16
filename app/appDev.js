;(function () {
    'use strict';


    angular.module('appDev', ['app', 'ngMockE2E'])
        .run(function ($httpBackend) {
            $httpBackend.whenGET(/^api\/.*/).passThrough();
            $httpBackend.whenGET(/^nav\/.*/).passThrough();
            $httpBackend.whenGET(/^admin\/.*/).passThrough();
            $httpBackend.whenGET(/^search\/.*/).passThrough();
            $httpBackend.whenGET(/^compare\/.*/).passThrough();
            $httpBackend.whenGET(/^common\/.*/).passThrough();
            $httpBackend.whenGET(/^product\/.*/).passThrough();
            $httpBackend.whenGET(/^overview\/.*/).passThrough();
            $httpBackend.whenGET(/^registration\/.*/).passThrough();
            $httpBackend.whenGET(/localhost:8080/).passThrough();
            $httpBackend.whenPOST(/localhost:8080/).passThrough();
            $httpBackend.whenGET(/rest/).passThrough();
            $httpBackend.whenPOST(/rest/).passThrough();
            $httpBackend.whenPOST(/keepalive/).passThrough();
            $httpBackend.whenGET(/openchpl.appspot.com/).passThrough();
            $httpBackend.whenGET(/ainq.com\/list_api_calls/).respond(200, apis.endpoints); // fake search results
        })
        .config(function ($provide) {
            $provide.decorator('$exceptionHandler', ['$delegate', '$log', function($delegate, $log) {
                return function (exception, cause) {
                    $delegate(exception, cause);
                    $log.debug(exception + "--" + cause + " " + exception.message);
                    //alert(exception.message);
                };
            }])
        })
})();
