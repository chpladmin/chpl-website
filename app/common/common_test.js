;(function () {
    'use strict';

    describe('[app.common module]', function () {

        beforeEach(module('app.common'));

        var $log;
        beforeEach(inject(function (_$log_) {
            $log = _$log_;
        }));
        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        describe('[common services]', function () {
            var commonService, $httpBackend;

            var aProduct = {id: 123, product: 'product 1', vendor: 'vendor 1'};

            beforeEach(inject(function (_commonService_, _$httpBackend_) {
                commonService = _commonService_;
                $httpBackend = _$httpBackend_;

                $httpBackend.whenGET('http://ainq.com/search?q=all').respond([1, 2, 3]);
                $httpBackend.whenGET('http://ainq.com/get_product?id=123').respond(aProduct);
            }));

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('"search" should return a promise', function () {
                $httpBackend.expectGET('http://ainq.com/search?q=all');
                expect(commonService.search('all').then).toBeDefined();
                $httpBackend.flush();
            });

            it('"search" should resolve with expected values', function () {
                commonService.search('all').then(function(response) {
                    expect(response).toEqual([1, 2, 3]);
                });
                $httpBackend.flush();
            });

            it('should return a promise when a particular product is searched for', function () {
                $httpBackend.expectGET('http://ainq.com/get_product?id=123');
                expect(commonService.getProduct('123').then).toBeDefined();
                $httpBackend.flush();
            });

            it('should return a product when a particular product is seached for', function () {
                commonService.getProduct('123').then(function(response) {
                    expect(response).toEqual(aProduct);
                });
                $httpBackend.flush();
            });

        });
    });
})();
