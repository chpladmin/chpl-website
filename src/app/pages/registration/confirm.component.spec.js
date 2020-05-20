(() => {
    'use strict';

    fdescribe('the Registration Confirm Account component', () => {
        var $compile, $log, $q, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.registration', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.confirmUser = jasmine.createSpy('confirmUser');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.confirmUser.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                scope.hash = 'fakehash';

                el = angular.element('<chpl-registration-confirm-user hash="hash"></chpl-registration-confirm-user>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            it('should have a "confirm user" function', () => {
                expect(ctrl.confirmUser).toBeDefined();
            });

            it('should have the hash as the string to confirm with', () => {
                expect(ctrl.userDetails).toBe('fakehash');
            });
        });
    });
})();
