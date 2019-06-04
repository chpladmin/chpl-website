(function () {
    'use strict';

    fdescribe('the Admin Reports component', function () {

        var $compile, $log, ctrl, el, scope;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.admin');

            inject(function (_$compile_, $controller, _$log_, $rootScope) {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new()

                el = angular.element('<ai-reports></ai-reports');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });
        });
    });
})();
