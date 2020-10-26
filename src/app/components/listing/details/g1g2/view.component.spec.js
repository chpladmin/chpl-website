(() => {
    'use strict';

    describe('the G1/G2 view component', () => {

        var $compile, $log, Mock, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl.components', 'chpl.mock');

            inject((_$compile_, _$log_, $rootScope, _Mock_) => {
                $compile = _$compile_;
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                scope.measures = Mock.listingMeasures;
                el = angular.element('<chpl-g1g2-view measures="measures"></chpl-g1g2-view>');

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

        describe('directive', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should have isolate scope object with instanciate members', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            it('should sort measures', () => {
                expect(ctrl.measures[0].measure.name).toBe('Doing a thing with stuff');
                expect(ctrl.measures[1].measure.name).toBe('Doing a thing with stuff again');
                expect(ctrl.measures[2].measure.name).toBe('Doing another thing with stuff');
            });

            it('should build a display value for associated criteria', () => {
                expect(ctrl.measures[1].displayCriteria).toBe('a5; b5');
            });
        });
    });
})();
