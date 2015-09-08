;(function () {
    'use strict';

    describe('app.common.services', function () {

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

        var commonService, $httpBackend;

        var mock = {};
        mock.aProduct = {id: 123, product: 'product 1', vendor: 'vendor 1'};
        mock.vendors = ['Vendor 1', 'Vendor 2'];
        mock.products = ['Product 1', 'Product 2'];
        mock.certs = ['Cert 1', 'Cert 2'];
        mock.cqms = ['CQM 1', 'CQM 2'];
        mock.editions = ['Edition 1', 'Edition 2'];
        mock.classifications = ['Classification 1', 'Classification 2'];
        mock.practices  = ['Practice 1', 'Practice 2'];
        mock.certBodies  = ['CB 1', 'CB 2'];


        beforeEach(inject(function (_commonService_, _$httpBackend_) {
            commonService = _commonService_;
            $httpBackend = _$httpBackend_;

            $httpBackend.whenGET('http://ainq.com/search?q=all').respond([mock.aProduct, mock.aProduct, mock.aProduct]);
            $httpBackend.whenGET('http://ainq.com/get_product?id=123').respond(mock.aProduct);
            $httpBackend.whenGET('http://ainq.com/list_certs').respond(mock.certs);
            $httpBackend.whenGET('http://ainq.com/list_cqms').respond(mock.cqms);
            $httpBackend.whenGET('http://ainq.com/list_editions').respond(mock.editions);
            $httpBackend.whenGET('http://ainq.com/list_classifications').respond(mock.classifications);
            $httpBackend.whenGET('http://ainq.com/list_practices').respond(mock.practices);
            $httpBackend.whenGET('http://ainq.com/list_vendors').respond(mock.vendors);
            $httpBackend.whenGET(/vendor\/list_vendors/).respond(mock.vendors);
            $httpBackend.whenGET('http://ainq.com/list_products').respond(mock.products);
            $httpBackend.whenGET('http://ainq.com/list_certBodies').respond(mock.certBodies);
            $httpBackend.whenGET('http://ainq.com/list_filterCerts').respond(mock.certs.concat(mock.cqms));
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
                expect(response).toEqual([mock.aProduct, mock.aProduct, mock.aProduct]);
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
                expect(response).toEqual(mock.aProduct);
            });
            $httpBackend.flush();
        });

        it('should return certs', function () {
            commonService.getCerts().then(function(response) {
                expect(response).toEqual(mock.certs);
            });
            $httpBackend.flush();
        });

        it('should return cqms', function () {
            commonService.getCQMs().then(function(response) {
                expect(response).toEqual(mock.cqms);
            });
            $httpBackend.flush();
        });

        it('should return classifications', function () {
            commonService.getClassifications().then(function(response) {
                expect(response).toEqual(mock.classifications);
            });
            $httpBackend.flush();
        });

        it('should return editions', function () {
            commonService.getEditions().then(function(response) {
                expect(response).toEqual(mock.editions);
            });
            $httpBackend.flush();
        });

        it('should return vendors', function () {
            commonService.getVendors().then(function(response) {
                expect(response).toEqual(mock.vendors);
            });
            $httpBackend.flush();
        });

        it('should return products', function () {
            commonService.getProducts().then(function(response) {
                expect(response).toEqual(mock.products);
            });
            $httpBackend.flush();
        });

        it('should return practices', function () {
            commonService.getPractices().then(function(response) {
                expect(response).toEqual(mock.practices);
            });
            $httpBackend.flush();
        });

        it('should return certification bodies', function () {
            commonService.getCertBodies().then(function(response) {
                expect(response).toEqual(mock.certBodies);
            });
            $httpBackend.flush();
        });

        it('should return certs and cqms', function () {
            commonService.getCertsNCQMs().then(function(response) {
                expect(response).toEqual(mock.certs.concat(mock.cqms));
            });
            $httpBackend.flush();
        });

        it('should calculate the number of active certs and cqms', function () {
            var data = [{ certs: [
                { certs: [{ isActive: true }]},
                { certs: [{ isActive: true }]},
                { certs: [{ isActive: false }]}
            ]}];
            data = commonService.extractInfo(data);

            expect(data[0].numCerts).toBe(2);
            expect(data[0].numCQMs).toBe(0);

        });
    });
})();
