(function () {
    'use strict';

    describe('the Charts component controller', function () {

        var $controller, $log, $q, mock, networkService, scope, vm;
        mock = {
            criterionProductStatisticsResult: [
                {id: 23, productCount: 2, certificationCriterionId: 74, criterion: '170.314 (a)(14)', creationDate: 1525888928985, deleted: false, lastModifiedDate: 1525888928985, lastModifiedUser: -3},
                {id: 24, productCount: 5, certificationCriterionId: 38, criterion: '170.315 (d)(10)', creationDate: 1525888929768, deleted: false, lastModifiedDate: 1525888929768, lastModifiedUser: -3},
                {id: 25, productCount: 18, certificationCriterionId: 37, criterion: '170.315 (d)(9)', creationDate: 1525888929814, deleted: false, lastModifiedDate: 1525888929814, lastModifiedUser: -3},
            ],
            sedParticipantStatisticsCounts: [
                {id: 187, sedCount: 7, participantCount: 130, creationDate: 1520357057186, deleted: false, lastModifiedDate: 1520357057186, lastModifiedUser: -3},
                {id: 188, sedCount: 2, participantCount: 67, creationDate: 1520357057200, deleted: false, lastModifiedDate: 1520357057200, lastModifiedUser: -3},
                {id: 189, sedCount: 2, participantCount: 72, creationDate: 1520357057202, deleted: false, lastModifiedDate: 1520357057202, lastModifiedUser: -3},
                {id: 190, sedCount: 61, participantCount: 10, creationDate: 1520357057204, deleted: false, lastModifiedDate: 1520357057204, lastModifiedUser: -3},
                {id: 191, sedCount: 11, participantCount: 11, creationDate: 1520357057205, deleted: false, lastModifiedDate: 1520357057205, lastModifiedUser: -3},
                {id: 192, sedCount: 4, participantCount: 12, creationDate: 1520357057207, deleted: false, lastModifiedDate: 1520357057207, lastModifiedUser: -3},
                {id: 193, sedCount: 2, participantCount: 13, creationDate: 1520357057209, deleted: false, lastModifiedDate: 1520357057209, lastModifiedUser: -3},
                {id: 194, sedCount: 1, participantCount: 14, creationDate: 1520357057210, deleted: false, lastModifiedDate: 1520357057210, lastModifiedUser: -3},
                {id: 195, sedCount: 3, participantCount: 15, creationDate: 1520357057212, deleted: false, lastModifiedDate: 1520357057212, lastModifiedUser: -3},
                {id: 196, sedCount: 7, participantCount: 16, creationDate: 1520357057213, deleted: false, lastModifiedDate: 1520357057213, lastModifiedUser: -3},
                {id: 197, sedCount: 1, participantCount: 81, creationDate: 1520357057215, deleted: false, lastModifiedDate: 1520357057215, lastModifiedUser: -3},
                {id: 198, sedCount: 6, participantCount: 83, creationDate: 1520357057216, deleted: false, lastModifiedDate: 1520357057216, lastModifiedUser: -3},
                {id: 199, sedCount: 9, participantCount: 20, creationDate: 1520357057218, deleted: false, lastModifiedDate: 1520357057218, lastModifiedUser: -3},
                {id: 200, sedCount: 1, participantCount: 21, creationDate: 1520357057219, deleted: false, lastModifiedDate: 1520357057219, lastModifiedUser: -3},
                {id: 201, sedCount: 3, participantCount: 22, creationDate: 1520357057221, deleted: false, lastModifiedDate: 1520357057221, lastModifiedUser: -3},
                {id: 202, sedCount: 3, participantCount: 23, creationDate: 1520357057222, deleted: false, lastModifiedDate: 1520357057222, lastModifiedUser: -3},
                {id: 203, sedCount: 4, participantCount: 24, creationDate: 1520357057224, deleted: false, lastModifiedDate: 1520357057224, lastModifiedUser: -3},
                {id: 204, sedCount: 3, participantCount: 25, creationDate: 1520357057226, deleted: false, lastModifiedDate: 1520357057226, lastModifiedUser: -3},
                {id: 205, sedCount: 1, participantCount: 26, creationDate: 1520357057227, deleted: false, lastModifiedDate: 1520357057227, lastModifiedUser: -3},
                {id: 206, sedCount: 1, participantCount: 93, creationDate: 1520357057228, deleted: false, lastModifiedDate: 1520357057228, lastModifiedUser: -3},
                {id: 207, sedCount: 2, participantCount: 159, creationDate: 1520357057229, deleted: false, lastModifiedDate: 1520357057229, lastModifiedUser: -3},
                {id: 208, sedCount: 2, participantCount: 31, creationDate: 1520357057230, deleted: false, lastModifiedDate: 1520357057230, lastModifiedUser: -3},
                {id: 209, sedCount: 2, participantCount: 32, creationDate: 1520357057231, deleted: false, lastModifiedDate: 1520357057231, lastModifiedUser: -3},
                {id: 210, sedCount: 2, participantCount: 34, creationDate: 1520357057233, deleted: false, lastModifiedDate: 1520357057233, lastModifiedUser: -3},
                {id: 211, sedCount: 4, participantCount: 35, creationDate: 1520357057234, deleted: false, lastModifiedDate: 1520357057234, lastModifiedUser: -3},
                {id: 212, sedCount: 2, participantCount: 104, creationDate: 1520357057235, deleted: false, lastModifiedDate: 1520357057235, lastModifiedUser: -3},
                {id: 213, sedCount: 1, participantCount: 172, creationDate: 1520357057236, deleted: false, lastModifiedDate: 1520357057236, lastModifiedUser: -3},
                {id: 214, sedCount: 1, participantCount: 44, creationDate: 1520357057237, deleted: false, lastModifiedDate: 1520357057237, lastModifiedUser: -3},
                {id: 215, sedCount: 2, participantCount: 113, creationDate: 1520357057239, deleted: false, lastModifiedDate: 1520357057239, lastModifiedUser: -3},
                {id: 216, sedCount: 2, participantCount: 51, creationDate: 1520357057240, deleted: false, lastModifiedDate: 1520357057240, lastModifiedUser: -3},
                {id: 217, sedCount: 3, participantCount: 56, creationDate: 1520357057241, deleted: false, lastModifiedDate: 1520357057241, lastModifiedUser: -3},
                {id: 218, sedCount: 1, participantCount: 121, creationDate: 1520357057243, deleted: false, lastModifiedDate: 1520357057243, lastModifiedUser: -3},
                {id: 219, sedCount: 1, participantCount: 124, creationDate: 1520357057244, deleted: false, lastModifiedDate: 1520357057244, lastModifiedUser: -3},
                {id: 220, sedCount: 1, participantCount: 255, creationDate: 1520357057246, deleted: false, lastModifiedDate: 1520357057246, lastModifiedUser: -3},
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
                {id: 1292, participantCount: 6, experienceMonths: 4, creationDate: 1521480655219, deleted: false, lastModifiedDate: 1521480655219, lastModifiedUser: -3},
                {id: 1293, participantCount: 1, experienceMonths: 260, creationDate: 1521480655221, deleted: false, lastModifiedDate: 1521480655221, lastModifiedUser: -3},
                {id: 1294, participantCount: 1, experienceMonths: 5, creationDate: 1521480655223, deleted: false, lastModifiedDate: 1521480655223, lastModifiedUser: -3},
                {id: 1295, participantCount: 27, experienceMonths: 6, creationDate: 1521480655227, deleted: false, lastModifiedDate: 1521480655227, lastModifiedUser: -3},
                {id: 1296, participantCount: 3, experienceMonths: 7, creationDate: 1521480655230, deleted: false, lastModifiedDate: 1521480655230, lastModifiedUser: -3},
                {id: 1297, participantCount: 94, experienceMonths: 264, creationDate: 1521480655232, deleted: false, lastModifiedDate: 1521480655232, lastModifiedUser: -3},
                {id: 1298, participantCount: 12, experienceMonths: 8, creationDate: 1521480655234, deleted: false, lastModifiedDate: 1521480655234, lastModifiedUser: -3},
                {id: 1299, participantCount: 2, experienceMonths: 9, creationDate: 1521480655235, deleted: false, lastModifiedDate: 1521480655235, lastModifiedUser: -3},
                {id: 1300, participantCount: 1, experienceMonths: 265, creationDate: 1521480655237, deleted: false, lastModifiedDate: 1521480655237, lastModifiedUser: -3},
                {id: 1301, participantCount: 9, experienceMonths: 10, creationDate: 1521480655239, deleted: false, lastModifiedDate: 1521480655239, lastModifiedUser: -3},
                {id: 1302, participantCount: 19, experienceMonths: 11, creationDate: 1521480655241, deleted: false, lastModifiedDate: 1521480655241, lastModifiedUser: -3},
                {id: 1303, participantCount: 117, experienceMonths: 12, creationDate: 1521480655243, deleted: false, lastModifiedDate: 1521480655243, lastModifiedUser: -3},
                {id: 1304, participantCount: 3, experienceMonths: 13, creationDate: 1521480655244, deleted: false, lastModifiedDate: 1521480655244, lastModifiedUser: -3},
                {id: 1305, participantCount: 6, experienceMonths: 14, creationDate: 1521480655246, deleted: false, lastModifiedDate: 1521480655246, lastModifiedUser: -3},
                {id: 1306, participantCount: 8, experienceMonths: 15, creationDate: 1521480655247, deleted: false, lastModifiedDate: 1521480655247, lastModifiedUser: -3},
                {id: 1307, participantCount: 2, experienceMonths: 528, creationDate: 1521480655249, deleted: false, lastModifiedDate: 1521480655249, lastModifiedUser: -3},
                {id: 1308, participantCount: 2, experienceMonths: 16, creationDate: 1521480655250, deleted: false, lastModifiedDate: 1521480655250, lastModifiedUser: -3},
                {id: 1309, participantCount: 24, experienceMonths: 18, creationDate: 1521480655251, deleted: false, lastModifiedDate: 1521480655251, lastModifiedUser: -3},
                {id: 1310, participantCount: 1, experienceMonths: 19, creationDate: 1521480655253, deleted: false, lastModifiedDate: 1521480655253, lastModifiedUser: -3},
                {id: 1311, participantCount: 63, experienceMonths: 276, creationDate: 1521480655254, deleted: false, lastModifiedDate: 1521480655254, lastModifiedUser: -3},
                {id: 1312, participantCount: 10, experienceMonths: 20, creationDate: 1521480655257, deleted: false, lastModifiedDate: 1521480655257, lastModifiedUser: -3},
                {id: 1313, participantCount: 3, experienceMonths: 21, creationDate: 1521480655259, deleted: false, lastModifiedDate: 1521480655259, lastModifiedUser: -3},
                {id: 1314, participantCount: 202, experienceMonths: 24, creationDate: 1521480655261, deleted: false, lastModifiedDate: 1521480655261, lastModifiedUser: -3},
                {id: 1315, participantCount: 5, experienceMonths: 25, creationDate: 1521480655263, deleted: false, lastModifiedDate: 1521480655263, lastModifiedUser: -3},
                {id: 1316, participantCount: 1, experienceMonths: 26, creationDate: 1521480655264, deleted: false, lastModifiedDate: 1521480655264, lastModifiedUser: -3},
                {id: 1317, participantCount: 2, experienceMonths: 27, creationDate: 1521480655266, deleted: false, lastModifiedDate: 1521480655266, lastModifiedUser: -3},
                {id: 1318, participantCount: 2, experienceMonths: 540, creationDate: 1521480655268, deleted: false, lastModifiedDate: 1521480655268, lastModifiedUser: -3},
                {id: 1319, participantCount: 2, experienceMonths: 28, creationDate: 1521480655269, deleted: false, lastModifiedDate: 1521480655269, lastModifiedUser: -3},
                {id: 1320, participantCount: 47, experienceMonths: 30, creationDate: 1521480655271, deleted: false, lastModifiedDate: 1521480655271, lastModifiedUser: -3},
                {id: 1321, participantCount: 28, experienceMonths: 288, creationDate: 1521480655273, deleted: false, lastModifiedDate: 1521480655273, lastModifiedUser: -3},
                {id: 1322, participantCount: 1, experienceMonths: 32, creationDate: 1521480655275, deleted: false, lastModifiedDate: 1521480655275, lastModifiedUser: -3},
                {id: 1323, participantCount: 1, experienceMonths: 33, creationDate: 1521480655278, deleted: false, lastModifiedDate: 1521480655278, lastModifiedUser: -3},
                {id: 1324, participantCount: 1, experienceMonths: 35, creationDate: 1521480655280, deleted: false, lastModifiedDate: 1521480655280, lastModifiedUser: -3},
                {id: 1325, participantCount: 350, experienceMonths: 36, creationDate: 1521480655282, deleted: false, lastModifiedDate: 1521480655282, lastModifiedUser: -3},
                {id: 1326, participantCount: 1, experienceMonths: 37, creationDate: 1521480655284, deleted: false, lastModifiedDate: 1521480655284, lastModifiedUser: -3},
                {id: 1327, participantCount: 4, experienceMonths: 38, creationDate: 1521480655286, deleted: false, lastModifiedDate: 1521480655286, lastModifiedUser: -3},
                {id: 1328, participantCount: 1, experienceMonths: 39, creationDate: 1521480655288, deleted: false, lastModifiedDate: 1521480655288, lastModifiedUser: -3},
                {id: 1329, participantCount: 4, experienceMonths: 41, creationDate: 1521480655290, deleted: false, lastModifiedDate: 1521480655290, lastModifiedUser: -3},
                {id: 1330, participantCount: 14, experienceMonths: 42, creationDate: 1521480655293, deleted: false, lastModifiedDate: 1521480655293, lastModifiedUser: -3},
                {id: 1331, participantCount: 171, experienceMonths: 300, creationDate: 1521480655295, deleted: false, lastModifiedDate: 1521480655295, lastModifiedUser: -3},
                {id: 1332, participantCount: 1, experienceMonths: 45, creationDate: 1521480655297, deleted: false, lastModifiedDate: 1521480655297, lastModifiedUser: -3},
                {id: 1333, participantCount: 1, experienceMonths: 47, creationDate: 1521480655299, deleted: false, lastModifiedDate: 1521480655299, lastModifiedUser: -3},
                {id: 1334, participantCount: 245, experienceMonths: 48, creationDate: 1521480655301, deleted: false, lastModifiedDate: 1521480655301, lastModifiedUser: -3},
                {id: 1335, participantCount: 3, experienceMonths: 50, creationDate: 1521480655303, deleted: false, lastModifiedDate: 1521480655303, lastModifiedUser: -3},
                {id: 1336, participantCount: 2, experienceMonths: 51, creationDate: 1521480655305, deleted: false, lastModifiedDate: 1521480655305, lastModifiedUser: -3},
            ],
        };

        beforeEach(function () {
            module('chpl.charts', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getCriterionProductStatistics = jasmine.createSpy('getCriterionProductStatistics');
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
                    expect(vm.criterionProductCounts[2014].data.rows.length).toBe(1);
                    expect(vm.criterionProductCounts[2015].data.rows.length).toBe(2);
                });

                it('should sort the results by criterion', function () {
                    expect(vm.criterionProductCounts[2015].data.rows[0].c[0].v).toBe('170.315 (d)(9)');
                });
            });
        });
    });
})();
