(function () {
    'use strict';

    describe('the Charts component controller', function () {

        var $controller, $log, $q, mock, networkService, scope, vm;
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
            sedParticipantStatisticsCounts: [
                {id: 187, sedCount: 7, participantCount: 130, creationDate: 1520357057186, deleted: false, lastModifiedDate: 1520357057186, lastModifiedUser: -3},
                {id: 188, sedCount: 2, participantCount: 67, creationDate: 1520357057200, deleted: false, lastModifiedDate: 1520357057200, lastModifiedUser: -3},
                {id: 189, sedCount: 2, participantCount: 72, creationDate: 1520357057202, deleted: false, lastModifiedDate: 1520357057202, lastModifiedUser: -3},
            ],
            participantAgeStatistics: [
                {id: 190, ageCount: 3, testParticipantAgeId: 2, ageRange: '10-19', creationDate: 1521480652992, deleted: false, lastModifiedDate: 1521480652992, lastModifiedUser: -3},
                {id: 191, ageCount: 740, testParticipantAgeId: 3, ageRange: '20-29', creationDate: 1521480652996, deleted: false, lastModifiedDate: 1521480652996, lastModifiedUser: -3},
                {id: 192, ageCount: 1801, testParticipantAgeId: 4, ageRange: '30-39', creationDate: 1521480652997, deleted: false, lastModifiedDate: 1521480652997, lastModifiedUser: -3},
                {id: 193, ageCount: 1406, testParticipantAgeId: 5, ageRange: '40-49', creationDate: 1521480652999, deleted: false, lastModifiedDate: 1521480652999, lastModifiedUser: -3},
                {id: 194, ageCount: 1065, testParticipantAgeId: 6, ageRange: '50-59', creationDate: 1521480653000, deleted: false, lastModifiedDate: 1521480653000, lastModifiedUser: -3},
                {id: 195, ageCount: 416, testParticipantAgeId: 7, ageRange: '60-69', creationDate: 1521480653002, deleted: false, lastModifiedDate: 1521480653002, lastModifiedUser: -3},
                {id: 196, ageCount: 10, testParticipantAgeId: 8, ageRange: '70-79', creationDate: 1521480653003, deleted: false, lastModifiedDate: 1521480653003, lastModifiedUser: -3},
            ],
            genderMockData: {
                id: 31,
                maleCount: 1748,
                femaleCount: 3693,
                creationDate: 1521480652800,
                deleted: false,
                lastModifiedDate: 1521480652800,
                lastModifiedUser: -3,
            },
            participantEducationStatistics: [
                {id: 185, educationCount: 7, educationTypeId: 1, education: 'No high school degree', creationDate: 1521480653169, deleted: false, lastModifiedDate: 1521480653169, lastModifiedUser: -3},
                {id: 186, educationCount: 225, educationTypeId: 2, education: 'High school graduate, diploma or the equivalent (for example: GED)', creationDate: 1521480653174, deleted: false, lastModifiedDate: 1521480653174, lastModifiedUser: -3},
                {id: 187, educationCount: 257, educationTypeId: 3, education: 'Some college credit, no degree', creationDate: 1521480653175, deleted: false, lastModifiedDate: 1521480653175, lastModifiedUser: -3},
                {id: 188, educationCount: 277, educationTypeId: 4, education: 'Trade/technical/vocational training', creationDate: 1521480653178, deleted: false, lastModifiedDate: 1521480653178, lastModifiedUser: -3},
                {id: 189, educationCount: 556, educationTypeId: 5, education: 'Associate degree', creationDate: 1521480653179, deleted: false, lastModifiedDate: 1521480653179, lastModifiedUser: -3},
                {id: 190, educationCount: 1600, educationTypeId: 6, education: 'Bachelor\'s degree', creationDate: 1521480653181, deleted: false, lastModifiedDate: 1521480653181, lastModifiedUser: -3},
                {id: 191, educationCount: 556, educationTypeId: 7, education: 'Master\'s degree', creationDate: 1521480653183, deleted: false, lastModifiedDate: 1521480653183, lastModifiedUser: -3},
                {id: 192, educationCount: 1963, educationTypeId: 9, education: 'Doctorate degree (e.g., MD, DNP, DMD, PhD)', creationDate: 1521480653185, deleted: false, lastModifiedDate: 1521480653185, lastModifiedUser: -3},
            ],
            participantExperienceStatistics: [
                {id: 1286, participantCount: 120, experienceMonths: -1, creationDate: 1521480655200, deleted: false, lastModifiedDate: 1521480655200, lastModifiedUser: -3},
                {id: 1287, participantCount: 16, experienceMonths: 0, creationDate: 1521480655204, deleted: false, lastModifiedDate: 1521480655204, lastModifiedUser: -3},
                {id: 1288, participantCount: 4, experienceMonths: 1, creationDate: 1521480655210, deleted: false, lastModifiedDate: 1521480655210, lastModifiedUser: -3},
                {id: 1289, participantCount: 18, experienceMonths: 2, creationDate: 1521480655214, deleted: false, lastModifiedDate: 1521480655214, lastModifiedUser: -3},
                {id: 1290, participantCount: 17, experienceMonths: 3, creationDate: 1521480655215, deleted: false, lastModifiedDate: 1521480655215, lastModifiedUser: -3},
                {id: 1291, participantCount: 2, experienceMonths: 516, creationDate: 1521480655217, deleted: false, lastModifiedDate: 1521480655217, lastModifiedUser: -3},
            ],
            nonconformityStatisticsResult: [
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
            ],
        };

        beforeEach(function () {
            module('chpl.charts', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
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

            inject(function (_$controller_, _$log_, _$q_, $rootScope, _networkService_) {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
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
                vm = $controller('ChartsController', {
                    $scope: scope,
                })
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should default to product charts, and 2014 edition', function () {
            expect(vm.chartState).toEqual({
                isStacked: 'false',
                listingCountType: '1',
                nonconformityType: 'All',
                productEdition: 2014,
                tab: 'product',
            });
        });

        describe('chart state', function () {
            it('should update stacking type', function () {
                expect(vm.listingCount.class['1'].chart.options.isStacked).toBeUndefined();
                vm.chartState.isStacked = 'fake';
                vm.updateChartStack();
                expect(vm.listingCount.class['1'].chart.options.isStacked).toBe('fake');
            });
        });

        describe('during load', function () {
            it('should load the sed participant count statistics', function () {
                expect(networkService.getSedParticipantStatisticsCount).toHaveBeenCalled();
                expect(vm.sedParticipantCounts.data.rows.length).toBe(mock.sedParticipantStatisticsCounts.length);
            });
            
            describe('of the nonconformity statistics', function () {
            	it('should load the nonconformity count statistics', function () {
            	    expect(networkService.getNonconformityStatisticsCount).toHaveBeenCalled();
                });

            	it('should filter data by nonconformity type', function () {
                    expect(vm.nonconformityCounts[2014].data.rows.length).toBe(16);
                    expect(vm.nonconformityCounts[2015].data.rows.length).toBe(5);
                    expect(vm.nonconformityCounts['All'].data.rows.length).toBe(24);
                    expect(vm.nonconformityCounts['Program'].data.rows.length).toBe(3);
                    expect(vm.nonconformityCounts['All'].data.rows.length).toBe(24);
                });
            	it('should format the data correctly', function () {
                    expect(vm.nonconformityCounts['All'].data.rows[0].c[0].v).toBe('170.315 (a)(1)');
                });
            });

            

            it('should load only 2014 data when filtered to', function () {
                expect(networkService.getNonconformityStatisticsCount).toHaveBeenCalled();
            });

            describe('of the criterion/product statistics', function () {
                it('should call the network service', function () {
                    expect(networkService.getCriterionProductStatistics).toHaveBeenCalled();
                });

                it('should filter the results by edition', function () {
                    expect(vm.criterionProductCounts[2014].data.rows.length).toBe(3);
                    expect(vm.criterionProductCounts[2015].data.rows.length).toBe(3);
                });

                it('should sort the results by criterion', function () {
                    expect(vm.criterionProductCounts[2015].data.rows[0].c[0].v).toBe('170.315 (a)(1)');
                });
            });

            describe('of the incumbent developers statistics', function () {
                it('should call the network service', function () {
                    expect(networkService.getIncumbentDevelopersStatistics).toHaveBeenCalled();
                });

                it('should generate three charts', function () {
                    expect(vm.incumbentDevelopersCounts.length).toBe(3);
                });

                it('should sort the charts and generate titles', function () {
                    expect(vm.incumbentDevelopersCounts[0].options.title).toBe('New vs. Incumbent Developers by Edition, 2011 to 2014');
                    expect(vm.incumbentDevelopersCounts[1].options.title).toBe('New vs. Incumbent Developers by Edition, 2011 to 2015');
                    expect(vm.incumbentDevelopersCounts[2].options.title).toBe('New vs. Incumbent Developers by Edition, 2014 to 2015');
                });

                it('should generate the 2011 to 2014 data', function () {
                    expect(vm.incumbentDevelopersCounts[0].data.rows[0].c[1].v).toBe(340);
                    expect(vm.incumbentDevelopersCounts[0].data.rows[1].c[1].v).toBe(537);
                });

                it('should generate the 2011 to 2015 data', function () {
                    expect(vm.incumbentDevelopersCounts[1].data.rows[0].c[1].v).toBe(82);
                    expect(vm.incumbentDevelopersCounts[1].data.rows[1].c[1].v).toBe(108);
                });

                it('should generate the 2014 to 2015 data', function () {
                    expect(vm.incumbentDevelopersCounts[2].data.rows[0].c[1].v).toBe(43);
                    expect(vm.incumbentDevelopersCounts[2].data.rows[1].c[1].v).toBe(147);
                });
            });

            describe('of the listing count statistics', function () {
                it('should call the network service', function () {
                    expect(networkService.getListingCountStatistics).toHaveBeenCalled();
                });

                it('should generate a chart object', function () {
                    expect(vm.listingCount).toBeDefined();
                });

                it('should have three options', function () {
                    expect(vm.listingCountTypes.length).toBe(3);
                });

                it('should have data for active 2014 products', function () {
                    expect(vm.listingCount.edition['1'].chart.data.rows[0].c[2].v).toBe(725);
                });
            });
        });
    });
})();
