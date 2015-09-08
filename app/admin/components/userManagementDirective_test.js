;(function () {
    'use strict';

    describe('app.admin.reports.directive', function () {

        var element, scope, $log;

        beforeEach(function () {

            module('app.admin');
            module('app/admin/components/userManagement.html');
        });

        beforeEach(inject(function ($compile, $rootScope, _$log_, $templateCache, $httpBackend) {
            $log = _$log_;
            scope = $rootScope.$new();

            scope.fakeFunction = function () {};

            var template = $templateCache.get('app/admin/components/userManagement.html');
            $templateCache.put('admin/components/userManagement.html', template);

            element = angular.element('<ai-user-management create-user="fakeFunction" modify-user="fakeFunction" delete-user="fakeFunction" cancel-user="fakeFunction"></ai-user-management');
            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should have CRUD user functions', function () {
            expect(element.isolateScope().createUser).toBeDefined();
            expect(element.isolateScope().modifyUser).toBeDefined();
            expect(element.isolateScope().deleteUser).toBeDefined();
            expect(element.isolateScope().cancelUser).toBeDefined();
        });

        it('should have an empty object for a new User', function () {
            expect(element.isolateScope().newUser).toEqual({});
        });
    });
})();
