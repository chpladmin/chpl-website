(() => {
    'use strict';

    fdescribe('the Charts component', () => {
        var $compile, $log, $q, $rootScope, ctrl, el, mock, networkService, scope;
        mock = {
            criterionProductStatisticsResult: [
                {id: 144, productCount: 928, certificationCriterionId: 63, criterion: {id: 63, number: '170.314 (a)(3)', title: 'Demographics', certificationEditionId: 2, certificationEdition: '2014', description: null}, creationDate: 1525902448277, deleted: false, lastModifiedDate: 1525902448277, lastModifiedUser: -3},
                {id: 208, productCount: 138, certificationCriterionId: 1, criterion: {id: 1, number: '170.315 (a)(1)', title: 'Computerized Provider Order Entry (CPOE) - Medications', certificationEditionId: 3, certificationEdition: '2015', description: null}, creationDate: 1525902448482, deleted: false, lastModifiedDate: 1525902448482, lastModifiedUser: -3},
                {id: 176, productCount: 138, certificationCriterionId: 3, criterion: {id: 3, number: '170.315 (a)(3)', title: 'CPOE - Diagnostic Imaging', certificationEditionId: 3, certificationEdition: '2015', description: null}, creationDate: 1525902448382, deleted: false, lastModifiedDate: 1525902448382, lastModifiedUser: -3},
                {id: 160, productCount: 847, certificationCriterionId: 62, criterion: {id: 62, number: '170.314 (a)(2)', title: 'Drug-drug, drug-allergy interactions checks', certificationEditionId: 2, certificationEdition: '2014', description: null}, creationDate: 1525902448328, deleted: false, lastModifiedDate: 1525902448328, lastModifiedUser: -3},
                {id: 161, productCount: 138, certificationCriterionId: 2, criterion: {id: 2, number: '170.315 (a)(2)', title: 'CPOE - Laboratory', certificationEditionId: 3, certificationEdition: '2015', description: null}, creationDate: 1525902448330, deleted: false, lastModifiedDate: 1525902448330, lastModifiedUser: -3},
                {id: 131, productCount: 906, certificationCriterionId: 64, criterion: {id: 64, number: '170.314 (a)(4)', title: 'Vital signs, body mass index, and growth Charts', certificationEditionId: 2, certificationEdition: '2014', description: null}, creationDate: 1525902448257, deleted: false, lastModifiedDate: 1525902448257, lastModifiedUser: -3},
            ],
            incumbentDevelopersStatisticsResult: [
                {id: 2, newCount: 82, incumbentCount: 108, oldCertificationEdition: {certificationEditionId: 1, year: '2011', retired: true}, newCertificationEdition: {certificationEditionId: 3, year: '2015', retired: false}},
                {id: 3, newCount: 43, incumbentCount: 147, oldCertificationEdition: {certificationEditionId: 2, year: '2014', retired: false}, newCertificationEdition: {certificationEditionId: 3, year: '2015', retired: false}},
                {id: 4, newCount: 340, incumbentCount: 537, oldCertificationEdition: {certificationEditionId: 1, year: '2011', retired: true}, newCertificationEdition: {certificationEditionId: 2, year: '2014', retired: false}},
            ],
            statisticsResult: [
                {id: 12, developerCount: 724, productCount: 725, certificationEdition: {certificationEditionId: 2, year: '2014', retired: false}, certificationStatus: {id: 1, name: 'Active'}},
                {id: 13, developerCount: 45, productCount: 46, certificationEdition: {certificationEditionId: 2, year: '2014', retired: false}, certificationStatus: {id: 4, name: 'Withdrawn by ONC-ACB'}},
                {id: 14, developerCount: 195, productCount: 196, certificationEdition: {certificationEditionId: 3, year: '2015', retired: false}, certificationStatus: {id: 1, name: 'Active'}},
                {id: 15, developerCount: 274, productCount: 275, certificationEdition: {certificationEditionId: 2, year: '2014', retired: false}, certificationStatus: {id: 3, name: 'Withdrawn by Developer'}},
                {id: 16, developerCount: 10, productCount: 11, certificationEdition: {certificationEditionId: 3, year: '2015', retired: false}, certificationStatus: {id: 3, name: 'Withdrawn by Developer'}},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.charts', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getCriterionProductStatistics = jasmine.createSpy('getCriterionProductStatistics');
                    $delegate.getIncumbentDevelopersStatistics = jasmine.createSpy('getIncumbentDevelopersStatistics');
                    $delegate.getListingCountStatistics = jasmine.createSpy('getListingCountStatistics');
                    $delegate.getNonconformityStatisticsCount = jasmine.createSpy('getNonconformityStatisticsCount');
                    $delegate.getSedParticipantStatisticsCount = jasmine.createSpy('getSedParticipantStatisticsCount');
                    $delegate.getParticipantGenderStatistics = jasmine.createSpy('getParticipantGenderStatistics');
                    $delegate.getParticipantAgeStatistics = jasmine.createSpy('getParticipantAgeStatistics');
                    $delegate.getParticipantEducationStatistics = jasmine.createSpy('getParticipantEducationStatistics');
                    $delegate.getParticipantProfessionalExperienceStatistics = jasmine.createSpy('getParticipantProfessionalExperienceStatistics');
                    $delegate.getParticipantComputerExperienceStatistics = jasmine.createSpy('getParticipantComputerExperienceStatistics');
                    $delegate.getParticipantProductExperienceStatistics = jasmine.createSpy('getParticipantProductExperienceStatistics');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, _$rootScope_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                networkService = _networkService_;
                networkService.getCriterionProductStatistics.and.returnValue($q.when(mock));
                networkService.getIncumbentDevelopersStatistics.and.returnValue($q.when(mock));
                networkService.getListingCountStatistics.and.returnValue($q.when(mock));
                networkService.getNonconformityStatisticsCount.and.returnValue($q.when(mock));
                networkService.getSedParticipantStatisticsCount.and.returnValue($q.when(mock));
                networkService.getParticipantGenderStatistics.and.returnValue($q.when(mock));
                networkService.getParticipantAgeStatistics.and.returnValue($q.when(mock));
                networkService.getParticipantEducationStatistics.and.returnValue($q.when(mock));
                networkService.getParticipantProfessionalExperienceStatistics.and.returnValue($q.when(mock));
                networkService.getParticipantComputerExperienceStatistics.and.returnValue($q.when(mock));
                networkService.getParticipantProductExperienceStatistics.and.returnValue($q.when(mock));

                scope = $rootScope.$new();
                el = angular.element('<chpl-charts></chpl-charts>');

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

            it('should default to product charts, and 2014 edition', () => {
                expect(ctrl.chartState).toEqual({
                    isStacked: 'false',
                    listingCountType: '1',
                    productEdition: 2014,
                    tab: 'product',
                });
            });

            describe('chart state', () => {
                it('should update stacking type', () => {
                    expect(ctrl.listingCount.class['1'].chart.options.isStacked).toBeUndefined();
                    ctrl.chartState.isStacked = 'fake';
                    ctrl.updateChartStack();
                    expect(ctrl.listingCount.class['1'].chart.options.isStacked).toBe('fake');
                });
            });

            describe('during load', () => {
                it('should load the sed participant count statistics', () => {
                    expect(networkService.getSedParticipantStatisticsCount).toHaveBeenCalled();
                });

                describe('of the nonconformity statistics', () => {
                    it('should load the nonconformity count statistics', () => {
                        expect(networkService.getNonconformityStatisticsCount).toHaveBeenCalled();
                    });
                });

                describe('of the criterion/product statistics', () => {
                    it('should call the network service', () => {
                        expect(networkService.getCriterionProductStatistics).toHaveBeenCalled();
                    });

                    it('should filter the results by edition', () => {
                        expect(ctrl.criterionProductCounts[2014].data.rows.length).toBe(3);
                        expect(ctrl.criterionProductCounts[2015].data.rows.length).toBe(3);
                    });

                    it('should sort the results by criterion', () => {
                        expect(ctrl.criterionProductCounts[2015].data.rows[0].c[0].v).toBe('170.315 (a)(1)');
                    });
                });

                describe('of the incumbent developers statistics', () => {
                    it('should call the network service', () => {
                        expect(networkService.getIncumbentDevelopersStatistics).toHaveBeenCalled();
                    });

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

                describe('of the listing count statistics', () => {
                    it('should call the network service', () => {
                        expect(networkService.getListingCountStatistics).toHaveBeenCalled();
                    });

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
    });
})();
