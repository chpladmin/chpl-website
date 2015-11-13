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
/*            $httpBackend.whenGET(/ainq.com\/list_certs/).respond(200, listCerts()); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_cqms/).respond(200, listCQMs()); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_editions/).respond(200, [{value: '2011'}, {value: '2014'}]); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_classifications/).respond(200, [{name: 'Complete EHR', id:'2'}, {name: 'Modular EHR', id:'1'}]); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_practices/).respond(200, [{name: 'Inpatient', id:'2'}, {name: 'Ambulatory', id:'1'}]); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_products/).respond(200, listProducts()); // list all products
            $httpBackend.whenGET(/ainq.com\/list_certBodies/).respond(200, certBodies); // list cerification bodies
            $httpBackend.whenGET(/ainq.com\/list_filterCerts/).respond(200, listFilterCerts()); // list cerification bodies
            $httpBackend.whenGET(/ainq.com\/list_certifiedProductActivity/).respond(200, listCertifiedProductActivity()); // list certifiedProduct activities
            $httpBackend.whenGET(/ainq.com\/list_vendorActivity/).respond(200, listVendorActivity()); // list vendor activities
            $httpBackend.whenGET(/ainq.com\/list_productActivity/).respond(200, listProductActivity()); // list product activities
            $httpBackend.whenGET(/ainq.com\/list_acbActivity/).respond(200, listAcbActivity()); // list product activities
            $httpBackend.whenGET(/ainq.com\/list_uploadingCps/).respond(200, [{vendor: {name: 'Vend', lastModifiedDate: '2013-03-02'}, product: {name: 'Prod', lastModifiedDate: '2014-05-02'},
                                                                               version: {name: '1.2.3'}, edition: '2014', uploadDate: '2015-07-02'}]); // list fake uploadingCps
            $httpBackend.whenPOST(/ainq.com\/create_invited_user/).respond(200, {});
            $httpBackend.whenPOST(/ainq.com\/authorize_user/).respond(200, {});
  */      })
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
