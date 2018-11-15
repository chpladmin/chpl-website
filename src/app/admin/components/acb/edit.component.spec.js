(function () {
    'use strict';

    describe('the ACB Edit component', function () {
        var $compile, $log, ctrl, el, scope;

        beforeEach(function () {
            inject(function (_$compile_, _$log_, $rootScope) {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.acb = {};
                scope.onChange = jasmine.createSpy('onChange');

                el = angular.element('<ai-acb-edit acb="acb" action="edit" on-change="$ctrl.onChange()');
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
