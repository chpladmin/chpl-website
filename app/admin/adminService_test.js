;(function () {
    'use strict';

    describe('app.admin', function () {

        var adminService, commonService, $httpBackend, $log;
        var mock = {};
        mock.vendor = {vendorId: 1, address: {}};
        mock.users = {users: [{user: {}},{user: {}}]};
        mock.userInvitation = {email: 'test@example.com', roles:['TEST']};
        mock.userAuthorization = {email: 'test@example.com', password: 'password', hash: 'hash'};
        mock.userContactDetails = {};


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
            $httpBackend.whenGET(/list_users/).respond(mock.users);
            $httpBackend.whenPOST(/invite_user/).respond({});
            $httpBackend.whenPOST(/create_invited_user/).respond({});
            $httpBackend.whenPOST(/authorize_user/).respond({});
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }

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

            it('should return a list of users', function () {
                adminService.getUsers()
                    .then(function (response) {
                        expect(response).toEqual(mock.users);
                    });
                $httpBackend.flush();
            });

            it('should return an empty object when inviteUser is called', function () {
                $httpBackend.expectPOST(/invite_user/, mock.userInvitation).respond(200, {});
                adminService.inviteUser(mock.userInvitation).then(function (response) {
                    expect(response).toEqual({});
                });
                $httpBackend.flush();
            });

            it('should return an empty object when createInvitedUser is called', function () {
                $httpBackend.expectPOST(/create_invited_user/, mock.userContactDetails).respond(200, {});
                adminService.createInvitedUser(mock.userContactDetails).then(function (response) {
                    expect(response).toEqual({});
                });
                $httpBackend.flush();
            });

            it('should return an empty object when authorizeUser is called', function () {
                $httpBackend.expectPOST(/authorize_user/, mock.userAuthorization).respond(200, {});
                adminService.authorizeUser(mock.userAuthorization).then(function (response) {
                    expect(response).toEqual({});
                });
                $httpBackend.flush();
            });
        });
    });
})();
