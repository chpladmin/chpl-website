(() => {
    'use strict';

    describe('the Listing Inspection component', () => {
        let $compile, $log, ctrl, el, mock, scope, utilService;

        mock = {
            listing: {
            },
            resources: {
                bodies: [],
                classifications: [],
                practices: [],
                qmsStandards: [],
                accessibilityStandards: [],
                targetedUsers: [],
                statuses: [],
                testingLabs: [],
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', 'chpl.mock', $provide => {
                $provide.decorator('utilService', $delegate => {
                    $delegate.certificationStatus = jasmine.createSpy('certificationStatus');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $rootScope, _utilService_) => {
                $compile = _$compile_;
                $log = _$log_;
                utilService = _utilService_;
                utilService.certificationStatus.and.returnValue('a status');

                scope = $rootScope.$new();
                scope.listing = mock.listing;
                scope.onChange = jasmine.createSpy('onChange');
                scope.resources = mock.resources;

                el = angular.element('<chpl-inspect-listing listing="listing" on-change="onChange(listing)" resources="resources"></chpl-inspect-listing>');
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
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });
        });
    });
})();
