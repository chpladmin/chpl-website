(() => {
    'use strict';

    describe('the Charts - Developer component', () => {
        var $compile, $log, $rootScope, ctrl, el, mock, scope;
        mock = {
            incumbentDevelopers: {incumbentDevelopersStatisticsResult: [
                {id: 2, newCount: 82, incumbentCount: 108, oldCertificationEdition: {certificationEditionId: 1, year: '2011', retired: true}, newCertificationEdition: {certificationEditionId: 3, year: '2015', retired: false}},
                {id: 3, newCount: 43, incumbentCount: 147, oldCertificationEdition: {certificationEditionId: 2, year: '2014', retired: false}, newCertificationEdition: {certificationEditionId: 3, year: '2015', retired: false}},
                {id: 4, newCount: 340, incumbentCount: 537, oldCertificationEdition: {certificationEditionId: 1, year: '2011', retired: true}, newCertificationEdition: {certificationEditionId: 2, year: '2014', retired: false}},
            ]},
            listingCountData: {statisticsResult: [
                {id: 12, developerCount: 724, productCount: 725, certificationEdition: {certificationEditionId: 2, year: '2014', retired: false}, certificationStatus: {id: 1, name: 'Active'}},
                {id: 13, developerCount: 45, productCount: 46, certificationEdition: {certificationEditionId: 2, year: '2014', retired: false}, certificationStatus: {id: 4, name: 'Withdrawn by ONC-ACB'}},
                {id: 14, developerCount: 195, productCount: 196, certificationEdition: {certificationEditionId: 3, year: '2015', retired: false}, certificationStatus: {id: 1, name: 'Active'}},
                {id: 15, developerCount: 274, productCount: 275, certificationEdition: {certificationEditionId: 2, year: '2014', retired: false}, certificationStatus: {id: 3, name: 'Withdrawn by Developer'}},
                {id: 16, developerCount: 10, productCount: 11, certificationEdition: {certificationEditionId: 3, year: '2015', retired: false}, certificationStatus: {id: 3, name: 'Withdrawn by Developer'}},
            ]},
        };

        beforeEach(() => {
            angular.mock.module('chpl.charts');

            inject((_$compile_, _$log_, _$rootScope_) => {
                $compile = _$compile_;
                $log = _$log_;
                $rootScope = _$rootScope_;

                scope = $rootScope.$new();
                scope.incumbentDevelopers = mock.incumbentDevelopers;
                scope.listingCountData = mock.listingCountData;
                el = angular.element('<chpl-charts-developer '
                                     + 'incumbent-developers="incumbentDevelopers" '
                                     + 'listing-count-data="listingCountData" '
                                     + '></chpl-charts-developer>');

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

            describe('chart state', () => {
                it('should update stacking type', () => {
                    expect(ctrl.listingCount.class['1'].chart.options.isStacked).toBeUndefined();
                    ctrl.chartState.isStacked = 'fake';
                    ctrl.updateChartStack();
                    expect(ctrl.listingCount.class['1'].chart.options.isStacked).toBe('fake');
                });
            });

            describe('with incumbent developer statistics', () => {
                it('should generate three charts', () => {
                    expect(ctrl.incumbentDevelopersCounts.length).toBe(3);
                });

                it('should sort the charts and generate titles', () => {
                    expect(ctrl.incumbentDevelopersCounts[0].options.title).toBe('New vs. Incumbent Developers by Edition, 2011 to 2014');
                    expect(ctrl.incumbentDevelopersCounts[1].options.title).toBe('New vs. Incumbent Developers by Edition, 2011 to 2015');
                    expect(ctrl.incumbentDevelopersCounts[2].options.title).toBe('New vs. Incumbent Developers by Edition, 2014 to 2015');
                });

                it('should generate the 2011 to 2014 data', () => {
                    expect(ctrl.incumbentDevelopersCounts[0].data.rows[0].c[1].v).toBe(340);
                    expect(ctrl.incumbentDevelopersCounts[0].data.rows[1].c[1].v).toBe(537);
                });

                it('should generate the 2011 to 2015 data', () => {
                    expect(ctrl.incumbentDevelopersCounts[1].data.rows[0].c[1].v).toBe(82);
                    expect(ctrl.incumbentDevelopersCounts[1].data.rows[1].c[1].v).toBe(108);
                });

                it('should generate the 2014 to 2015 data', () => {
                    expect(ctrl.incumbentDevelopersCounts[2].data.rows[0].c[1].v).toBe(43);
                    expect(ctrl.incumbentDevelopersCounts[2].data.rows[1].c[1].v).toBe(147);
                });
            });

            describe('with listing count statistics', () => {
                it('should generate a chart object', () => {
                    expect(ctrl.listingCount).toBeDefined();
                });

                it('should have three options', () => {
                    expect(ctrl.listingCountTypes.length).toBe(3);
                });

                it('should have data for active 2014 products', () => {
                    expect(ctrl.listingCount.edition['1'].chart.data.rows[0].c[2].v).toBe(725);
                });
            });
        });
    });
})();
