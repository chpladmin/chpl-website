(() => {
    'use strict';

    fdescribe('the Charts - SED component', () => {
        var $compile, $log, $rootScope, ctrl, el, mock, scope;
        mock = {
            sedParticipantStatisticsCount: { sedParticipantStatisticsCounts: [
                {id: 187, sedCount: 7, participantCount: 130, creationDate: 1520357057186, deleted: false, lastModifiedDate: 1520357057186, lastModifiedUser: -3},
                {id: 188, sedCount: 2, participantCount: 67, creationDate: 1520357057200, deleted: false, lastModifiedDate: 1520357057200, lastModifiedUser: -3},
                {id: 189, sedCount: 2, participantCount: 72, creationDate: 1520357057202, deleted: false, lastModifiedDate: 1520357057202, lastModifiedUser: -3},
            ]},
            participantAgeCount: { participantAgeStatistics: [
                {id: 190, ageCount: 3, testParticipantAgeId: 2, ageRange: '10-19', creationDate: 1521480652992, deleted: false, lastModifiedDate: 1521480652992, lastModifiedUser: -3},
                {id: 191, ageCount: 740, testParticipantAgeId: 3, ageRange: '20-29', creationDate: 1521480652996, deleted: false, lastModifiedDate: 1521480652996, lastModifiedUser: -3},
                {id: 192, ageCount: 1801, testParticipantAgeId: 4, ageRange: '30-39', creationDate: 1521480652997, deleted: false, lastModifiedDate: 1521480652997, lastModifiedUser: -3},
                {id: 193, ageCount: 1406, testParticipantAgeId: 5, ageRange: '40-49', creationDate: 1521480652999, deleted: false, lastModifiedDate: 1521480652999, lastModifiedUser: -3},
                {id: 194, ageCount: 1065, testParticipantAgeId: 6, ageRange: '50-59', creationDate: 1521480653000, deleted: false, lastModifiedDate: 1521480653000, lastModifiedUser: -3},
                {id: 195, ageCount: 416, testParticipantAgeId: 7, ageRange: '60-69', creationDate: 1521480653002, deleted: false, lastModifiedDate: 1521480653002, lastModifiedUser: -3},
                {id: 196, ageCount: 10, testParticipantAgeId: 8, ageRange: '70-79', creationDate: 1521480653003, deleted: false, lastModifiedDate: 1521480653003, lastModifiedUser: -3},
            ]},
            genderMockData: {
                id: 31,
                maleCount: 1748,
                femaleCount: 3693,
                creationDate: 1521480652800,
                deleted: false,
                lastModifiedDate: 1521480652800,
                lastModifiedUser: -3,
            },
            participantEducationCount: {participantEducationStatistics: [
                {id: 185, educationCount: 7, educationTypeId: 1, education: 'No high school degree', creationDate: 1521480653169, deleted: false, lastModifiedDate: 1521480653169, lastModifiedUser: -3},
                {id: 186, educationCount: 225, educationTypeId: 2, education: 'High school graduate, diploma or the equivalent (for example: GED)', creationDate: 1521480653174, deleted: false, lastModifiedDate: 1521480653174, lastModifiedUser: -3},
                {id: 187, educationCount: 257, educationTypeId: 3, education: 'Some college credit, no degree', creationDate: 1521480653175, deleted: false, lastModifiedDate: 1521480653175, lastModifiedUser: -3},
                {id: 188, educationCount: 277, educationTypeId: 4, education: 'Trade/technical/vocational training', creationDate: 1521480653178, deleted: false, lastModifiedDate: 1521480653178, lastModifiedUser: -3},
                {id: 189, educationCount: 556, educationTypeId: 5, education: 'Associate degree', creationDate: 1521480653179, deleted: false, lastModifiedDate: 1521480653179, lastModifiedUser: -3},
                {id: 190, educationCount: 1600, educationTypeId: 6, education: 'Bachelor\'s degree', creationDate: 1521480653181, deleted: false, lastModifiedDate: 1521480653181, lastModifiedUser: -3},
                {id: 191, educationCount: 556, educationTypeId: 7, education: 'Master\'s degree', creationDate: 1521480653183, deleted: false, lastModifiedDate: 1521480653183, lastModifiedUser: -3},
                {id: 192, educationCount: 1963, educationTypeId: 9, education: 'Doctorate degree (e.g., MD, DNP, DMD, PhD)', creationDate: 1521480653185, deleted: false, lastModifiedDate: 1521480653185, lastModifiedUser: -3},
            ]},
            participantExperienceCount: {participantExperienceStatistics: [
                {id: 1286, participantCount: 120, experienceMonths: -1, creationDate: 1521480655200, deleted: false, lastModifiedDate: 1521480655200, lastModifiedUser: -3},
                {id: 1287, participantCount: 16, experienceMonths: 0, creationDate: 1521480655204, deleted: false, lastModifiedDate: 1521480655204, lastModifiedUser: -3},
                {id: 1288, participantCount: 4, experienceMonths: 1, creationDate: 1521480655210, deleted: false, lastModifiedDate: 1521480655210, lastModifiedUser: -3},
                {id: 1289, participantCount: 18, experienceMonths: 2, creationDate: 1521480655214, deleted: false, lastModifiedDate: 1521480655214, lastModifiedUser: -3},
                {id: 1290, participantCount: 17, experienceMonths: 3, creationDate: 1521480655215, deleted: false, lastModifiedDate: 1521480655215, lastModifiedUser: -3},
                {id: 1291, participantCount: 2, experienceMonths: 516, creationDate: 1521480655217, deleted: false, lastModifiedDate: 1521480655217, lastModifiedUser: -3},
            ]},
        };

        beforeEach(() => {
            angular.mock.module('chpl.charts');

            inject((_$compile_, _$log_, _$rootScope_) => {
                $compile = _$compile_;
                $log = _$log_;
                $rootScope = _$rootScope_;

                scope = $rootScope.$new();
                scope.sedParticipantStatisticsCount = mock.sedParticipantStatisticsCount;
                scope.participantGenderCount = mock.genderMockData;
                scope.participantAgeCount = mock.participantAgeCount;
                scope.participantEducationCount = mock.participantEducationCount;
                scope.participantProfessionalExperienceCount = mock.participantExperienceCount;
                scope.participantComputerExperienceCount = mock.participantExperienceCount;
                scope.participantProductExperienceCount = mock.participantExperienceCount;
                el = angular.element('<chpl-charts-sed '
                                     + 'sed-participant-statistics-count="sedParticipantStatisticsCount" '
                                     + 'participant-gender-count="participantGenderCount" '
                                     + 'participant-age-count="participantAgeCount" '
                                     + 'participant-education-count="participantEducationCount" '
                                     + 'participant-professional-experience-count="participantProfessionalExperienceCount" '
                                     + 'participant-computer-experience-count="participantComputerExperienceCount" '
                                     + 'participant-product-experience-count="participantProductExperienceCount" '
                                     + '></chpl-charts-sed>');

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
