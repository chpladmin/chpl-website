(() => {
    'use strict';

    fdescribe('the Version component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            version: {
                versionId: 636, version: 'v1.', lastModifiedDate: null,
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.version = mock.version;
                scope.canEdit = true;
                scope.canMerge = true;
                scope.onEdit = jasmine.createSpy('onEdit');

                el = angular.element('<chpl-version version="version" can-edit="canEdit" can-merge="canMerge" on-edit="onEdit()"></chpl-version>');

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
