;(function () {
    'use strict';

    describe('app.admin.acbManagement.directive', function () {

        var element, scope, $log, authService;

        beforeEach(function () {
            var mockAuthService = {};

            module('app.admin', function($provide) {
                $provide.value('authService', mockAuthService);
            });

            module('app/admin/components/acbManagement.html');
            module('app/admin/components/userManagement.html');

            inject(function($q) {
                mockAuthService.isAcbAdmin = function () {
                    return true;
                };

                mockAuthService.isChplAdmin = function () {
                    return true;
                };
            });
        });

        beforeEach(inject(function ($compile, $rootScope, _$log_, $templateCache, $httpBackend) {
            $log = _$log_;
            scope = $rootScope.$new();

            scope.fakeFunction = function () {};

            var template = $templateCache.get('app/admin/components/acbManagement.html');
            $templateCache.put('admin/components/acbManagement.html', template);
            template = $templateCache.get('app/admin/components/userManagement.html');
            $templateCache.put('admin/components/userManagement.html', template);

            element = angular.element('<ai-acb-management create-acb="fakeFunction"></ai-acb-management');
            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should have a function to create an ACB', function () {
            expect(element.isolateScope().createACB).toBeDefined();
        });

        it('should have an empty object for a new ACB', function () {
            expect(element.isolateScope().newACB).toEqual({});
        });

        it('should know if the logged in user is ACB and/or CHPL admin', function () {
            expect(element.isolateScope().isAcbAdmin).toBeTruthy();
            expect(element.isolateScope().isChplAdmin).toBeTruthy();
        });
    });
})();
