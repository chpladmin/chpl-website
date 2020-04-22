(() => {
    'use strict';

    xdescribe('the Reports.Products component', () => {

        var $compile, $log, $q, Mock, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.reports', $provide => {
                $provide.factory('chplFilterDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getActivityMetadata = jasmine.createSpy('getActivityMetadata');
                    $delegate.getActivityById = jasmine.createSpy('getActivityById');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _Mock_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                networkService = _networkService_;
                networkService.getActivityMetadata.and.returnValue($q.when(Mock.productReportsMetadata));
                networkService.getActivityById.and.returnValue($q.when(Mock.listingActivity));

                scope = $rootScope.$new()

                el = angular.element('<chpl-reports-products></chpl-reports-products>');

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
            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            describe('when filter is selected', () => {
                it('should populate model with filter values', () => {
                    let filter = {
                        'startDate': '2019-01-01T05:00:00.000Z',
                        'endDate': '2019-01-30T05:00:00.000Z',
                        'dataFilter': 'medco',
                        'tableState': {
                            'sort': {
                                'predicate': 'date',
                                'reverse': true,
                            },
                            'search': {
                                'predicateObject': {},
                            },
                            'pagination': {
                                'start': 0,
                                'totalItemCount': 60,
                            },
                        },
                    };
                    ctrl.onApplyFilter(angular.toJson(filter));
                    expect(ctrl.filterText).toBe('medco');
                    expect(ctrl.activityRange.startDate).toEqual(new Date(Date.parse(filter.startDate)));
                    expect(ctrl.activityRange.endDate).toEqual(new Date(Date.parse(filter.endDate)));
                });
            });

            describe('when save filter is clicked', () => {
                it('should create a filter object for saving', () => {
                    ctrl.activityRange.startDate = new Date(Date.parse('2019-01-01T05:00:00.000Z'));
                    ctrl.activityRange.endDate = new Date(Date.parse('2019-01-30T05:00:00.000Z'));
                    ctrl.filterText = 'medco';

                    let filter = ctrl.createFilterDataObject();

                    expect(filter.startDate).toBe(ctrl.activityRange.startDate);
                    expect(filter.endDate).toBe(ctrl.activityRange.endDate);
                    expect(filter.dataFilter).toBe(ctrl.filterText);
                })
            });
        });
    });
})();
