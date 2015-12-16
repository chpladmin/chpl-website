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
        mock.practices  = ['Practice 1', 'Practice 2'];
        mock.certBodies  = ['CB 1', 'CB 2'];


        beforeEach(inject(function (_commonService_, _$httpBackend_) {
            commonService = _commonService_;
            $httpBackend = _$httpBackend_;

            $httpBackend.whenGET('http://ainq.com/search?q=all').respond([mock.aProduct, mock.aProduct, mock.aProduct]);
            $httpBackend.whenGET(/certified_product\/get_certified_product?certifiedProductId=123/).respond(mock.aProduct);
            $httpBackend.whenGET('http://ainq.com/list_certs').respond(mock.certs);
            $httpBackend.whenGET('http://ainq.com/list_cqms').respond(mock.cqms);
            $httpBackend.whenGET(/data\/certification_editions/).respond(mock.editions);
            $httpBackend.whenGET(/data\/practice_types/).respond(mock.practices);
            $httpBackend.whenGET(/vendors\//).respond(mock.vendors);
            $httpBackend.whenGET(/list_vendor_names/).respond(mock.vendors);
            $httpBackend.whenGET(/list_product_names/).respond(mock.products);
            $httpBackend.whenGET(/data\/certification_bodies/).respond(mock.certBodies);
            $httpBackend.whenGET('http://ainq.com/list_filterCerts').respond(mock.certs.concat(mock.cqms));
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
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
    });
})();
