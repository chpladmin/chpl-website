(function () {
    'use strict';

    describe('the "Cures Update" highlight', () => {

        let $compile, $log, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl.components')
        });

        beforeEach(inject((_$compile_, _$log_, $rootScope) => {
            $compile = _$compile_;
            $log = _$log_;
            scope = $rootScope.$new();
            scope.text = 'text (Cures Update)';

            el = angular.element('<span chpl-highlight-cures ng-model="text"></span>');
            $compile(el)(scope);
            scope.$digest();
        }));

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('template', () => {
            it('should highlight part of the text', () => {
                expect(el.html()).toBe('text <span class="cures-update">(Cures Update)</span>');
            });

            it('should not highlight when no need', () => {
                scope.text = 'text';
                scope.$digest();
                expect(el.html()).toBe('text');
            });
        });
    });
})();
