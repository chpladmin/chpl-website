(() => {
    'use strict';

    fdescribe('the Charts - Surveillance component', () => {
        var $compile, $log, $rootScope, ctrl, el, mock, scope;
        mock = {
            nonconformityCriteriaCount: {nonconformityStatisticsResult: [
                {id: null, nonconformityCount: 2, nonconformityType: '170.314 (a)(11)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 2, nonconformityType: '170.314 (b)(1)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 20, nonconformityType: '170.314 (b)(7)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 3, nonconformityType: '170.315 (f)(1)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 19, nonconformityType: '170.523 (k)(1)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 1, nonconformityType: '170.314 (d)(2)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 1, nonconformityType: '170.315 (a)(1)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 2, nonconformityType: '170.314 (a)(8)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 257, nonconformityType: '170.314 (f)(2)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 2, nonconformityType: '170.315 (e)(1)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 8, nonconformityType: '170.314 (b)(2)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 14, nonconformityType: '170.314 (c)(3)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 2, nonconformityType: '170.314 (b)(3)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 15, nonconformityType: '170.314 (e)(1)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 2, nonconformityType: '170.314 (b)(4)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 2, nonconformityType: '170.314 (e)(2)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 104, nonconformityType: '170.523 (k)(2)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 1, nonconformityType: '170.315 (d)(2)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 1, nonconformityType: '170.314 (g)(2)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 13, nonconformityType: '170.314 (c)(1)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 2, nonconformityType: '170.314 (a)(13)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 9, nonconformityType: '170.314 (c)(2)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 1, nonconformityType: '170.315 (c)(2)', deleted: false, lastModifiedUser: -2, creationDate: 1531422312250, lastModifiedDate: 1531422312250},
                {id: null, nonconformityCount: 63, nonconformityType: 'Other Non-Conformity', deleted: false, lastModifiedUser: -2,creationDate: 1531422312250, lastModifiedDate: 1531422312250},
            ]},
        };

        beforeEach(() => {
            angular.mock.module('chpl.charts');

            inject((_$compile_, _$log_, _$rootScope_) => {
                $compile = _$compile_;
                $log = _$log_;
                $rootScope = _$rootScope_;

                scope = $rootScope.$new();
                scope.nonconformityCriteriaCount = mock.nonconformityCriteriaCount;
                el = angular.element('<chpl-charts-surveillance '
                                     + 'nonconformity-criteria-count="nonconformityCriteriaCount" '
                                     + '></chpl-charts-surveillance>');

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

            it('should filter data by nonconformity type', () => {
                expect(ctrl.nonconformityCounts[2014].data.rows.length).toBe(16);
                expect(ctrl.nonconformityCounts[2015].data.rows.length).toBe(5);
                expect(ctrl.nonconformityCounts['All'].data.rows.length).toBe(24);
                expect(ctrl.nonconformityCounts['Program'].data.rows.length).toBe(3);
                expect(ctrl.nonconformityCounts['All'].data.rows.length).toBe(24);
            });

            it('should format the data correctly', () => {
                expect(ctrl.nonconformityCounts['All'].data.rows[0].c[0].v).toBe('170.314 (a)(8)');
            });
        });
    });
})();
