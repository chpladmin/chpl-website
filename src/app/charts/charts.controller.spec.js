(function () {
    'use strict';

    fdescribe('the Charts component controller', function () {

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
            incumbentDevelopersMockData: {
                id: 1,
                new2011To2014: 36,
                new2011To2015: 35,
                new2014To2015: 37,
                incumbent2011To2014: 2,
                incumbent2011To2015: 3,
                incumbent2014To2015: 1,
                creationDate: 1526667394053,
                deleted: false,
                lastModifiedDate: 1526667394053,
                lastModifiedUser: -3,
            },
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
        };

        beforeEach(function () {
            module('chpl.charts', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getCriterionProductStatistics = jasmine.createSpy('getCriterionProductStatistics');
                    $delegate.getIncumbentDevelopersStatistics = jasmine.createSpy('getIncumbentDevelopersStatistics');
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
                networkService.getIncumbentDevelopersStatistics.and.returnValue($q.when(mock.incumbentDevelopersMockData));
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
                tab: 'product',
                productEdition: 2014,
            });
        });

        describe('during load', function () {
            it('should load the sed participant count statistics', function () {
                expect(networkService.getSedParticipantStatisticsCount).toHaveBeenCalled();
                expect(vm.sedParticipantCounts.data.rows.length).toBe(mock.sedParticipantStatisticsCounts.length);
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

                it('should generate the 2011 to 2014 data', function () {
                    expect(vm.incumbentDevelopersCounts.from2011to2014.data.rows[0].c[1].v).toBe(36);
                    expect(vm.incumbentDevelopersCounts.from2011to2014.data.rows[1].c[1].v).toBe(2);
                });

                it('should generate the 2011 to 2015 data', function () {
                    expect(vm.incumbentDevelopersCounts.from2011to2015.data.rows[0].c[1].v).toBe(35);
                    expect(vm.incumbentDevelopersCounts.from2011to2015.data.rows[1].c[1].v).toBe(3);
                });

                it('should generate the 2014 to 2015 data', function () {
                    expect(vm.incumbentDevelopersCounts.from2014to2015.data.rows[0].c[1].v).toBe(37);
                    expect(vm.incumbentDevelopersCounts.from2014to2015.data.rows[1].c[1].v).toBe(1);
                });
            });
        });
    });
})();
