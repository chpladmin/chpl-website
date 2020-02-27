(() => {
    'use strict';

    fdescribe('the Charts - Product component', () => {
        var $compile, $log, $rootScope, ctrl, el, mock, scope;
        mock = {
            criterionProductCount: {criterionProductStatisticsResult: [
                {id: 144, productCount: 928, certificationCriterionId: 63, criterion: {id: 63, number: '170.314 (a)(3)', title: 'Demographics', certificationEditionId: 2, certificationEdition: '2014', description: null}, creationDate: 1525902448277, deleted: false, lastModifiedDate: 1525902448277, lastModifiedUser: -3},
                {id: 208, productCount: 138, certificationCriterionId: 1, criterion: {id: 1, number: '170.315 (a)(1)', title: 'Computerized Provider Order Entry (CPOE) - Medications', certificationEditionId: 3, certificationEdition: '2015', description: null}, creationDate: 1525902448482, deleted: false, lastModifiedDate: 1525902448482, lastModifiedUser: -3},
                {id: 176, productCount: 138, certificationCriterionId: 3, criterion: {id: 3, number: '170.315 (a)(3)', title: 'CPOE - Diagnostic Imaging', certificationEditionId: 3, certificationEdition: '2015', description: null}, creationDate: 1525902448382, deleted: false, lastModifiedDate: 1525902448382, lastModifiedUser: -3},
                {id: 160, productCount: 847, certificationCriterionId: 62, criterion: {id: 62, number: '170.314 (a)(2)', title: 'Drug-drug, drug-allergy interactions checks', certificationEditionId: 2, certificationEdition: '2014', description: null}, creationDate: 1525902448328, deleted: false, lastModifiedDate: 1525902448328, lastModifiedUser: -3},
                {id: 161, productCount: 138, certificationCriterionId: 2, criterion: {id: 2, number: '170.315 (a)(2)', title: 'CPOE - Laboratory', certificationEditionId: 3, certificationEdition: '2015', description: null}, creationDate: 1525902448330, deleted: false, lastModifiedDate: 1525902448330, lastModifiedUser: -3},
                {id: 131, productCount: 906, certificationCriterionId: 64, criterion: {id: 64, number: '170.314 (a)(4)', title: 'Vital signs, body mass index, and growth Charts', certificationEditionId: 2, certificationEdition: '2014', description: null}, creationDate: 1525902448257, deleted: false, lastModifiedDate: 1525902448257, lastModifiedUser: -3},
            ]},
        };

        beforeEach(() => {
            angular.mock.module('chpl.charts');

            inject((_$compile_, _$log_, _$rootScope_) => {
                $compile = _$compile_;
                $log = _$log_;
                $rootScope = _$rootScope_;

                scope = $rootScope.$new();
                scope.criterionProductCount = mock.criterionProductCount;
                el = angular.element('<chpl-charts-product '
                                     + 'criterion-product="criterionProductCount" '
                                     + '></chpl-charts-product>');

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

            it('should filter the results by edition', () => {
                expect(ctrl.criterionProductCounts[2014].data.rows.length).toBe(3);
                expect(ctrl.criterionProductCounts[2015].data.rows.length).toBe(3);
            });

            it('should sort the results by criterion', () => {
                expect(ctrl.criterionProductCounts[2015].data.rows[0].c[0].v).toBe('170.315 (a)(1)');
            });
        });
    });
})();
