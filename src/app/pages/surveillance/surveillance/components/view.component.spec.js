(() => {
    'use strict';

    fdescribe('the Surveillance Management View component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            listing: {},
        };

        beforeEach(() => {
            angular.mock.module('chpl.surveillance', $provide => {
                $provide.factory('aiSurveillanceDirective', () => ({}));
            });

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.listing = mock.listing;

                el = angular.element('<chpl-surveillance-management-view listing="listing"></chpl-surveillance-management-view>');

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
        });
    });
})();
