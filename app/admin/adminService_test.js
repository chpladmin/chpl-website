;(function () {
    'use strict';

    describe('app.admin', function () {

        var adminService, commonService, $httpBackend, $log;
        var mock = {};
        mock.vendor = {vendorId: 1, address: {}};


        beforeEach(function () {
            var mockCommonService = {};

            module('app.admin', function ($provide) {
                $provide.constant('API', 'http://localhost:8080/chpl-service');
            })
        });

        beforeEach(inject(function (_$log_, _adminService_, _commonService_, _$httpBackend_) {
            $log = _$log_;
            adminService  = _adminService_;
            commonService = _commonService_;
            $httpBackend = _$httpBackend_;

            $httpBackend.whenPOST(/vendor\/update_vendor/).respond(mock.vendor);
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('service', function () {
            it('should return the updated vendor', function () {
                adminService.updateVendor(mock.vendor).then(function(response) {
                    expect(response).toEqual(mock.vendor);
                });
                $httpBackend.flush();
            });

            it('should return a reject if the response is not the right type', function () {
                $httpBackend.expectPOST(/vendor\/update_vendor/, mock.vendor).respond(200, 'bad data');
                adminService.updateVendor(mock.vendor).then(function(response) {
                    expect(response.data).toEqual('bad data');
                });
                $httpBackend.flush();
            });

            it('should return a reject if the response fails', function () {
                $httpBackend.expectPOST(/vendor\/update_vendor/, mock.vendor).respond(500, 'bad data');
                adminService.updateVendor(mock.vendor).then(function(response) {
                    expect(response.status).toEqual(500);
                });
                $httpBackend.flush();
            });
        });
    });
})();
