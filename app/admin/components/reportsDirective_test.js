;(function () {
    'use strict';

    describe('app.admin.reports.directive', function () {

        var element, scope, $log, commonService, authService, ctrl;

        beforeEach(function () {
            var mockCommonService = {};
            var mockAuthService = {};

            module('app.admin', function($provide) {
                $provide.value('commonService', mockCommonService);
                $provide.value('authService', mockAuthService);
            });

            module('app/admin/components/reports.html');

            inject(function($q) {
                mockCommonService.developerActivity = [{"id":16,"description":"Developer Epic Systems Corporation was updated.","originalData":{"developerCode":"1448","id":449,"address":null,"contact":null,"creationDate":1459774929469,"deleted":false,"lastModifiedDate":1459774929469,"lastModifiedUser":-1,"name":"Epic Systems Corporation","website":null,"transparencyAttestationMappings":[{"id":null,"developerId":449,"acbId":1,"acbName":"InfoGard","transparencyAttestation":null},{"id":null,"developerId":449,"acbId":3,"acbName":"Drummond Group Inc.","transparencyAttestation":null},{"id":null,"developerId":449,"acbId":6,"acbName":"ICSA Labs","transparencyAttestation":null}]},"newData":{"developerCode":"1448","id":449,"address":{"id":1,"streetLineOne":"1979 Milky Way","streetLineTwo":null,"city":"Verona","state":"WI","zipcode":"53593","country":"USA","creationDate":1459887759394,"deleted":false,"lastModifiedDate":1459887759394,"lastModifiedUser":-2},"contact":{"id":4,"firstName":"","lastName":"Sasha TerMaat","email":"epic@epic.com","phoneNumber":"1233211234","title":null,"signatureDate":null},"creationDate":1459774929469,"deleted":false,"lastModifiedDate":1459887759472,"lastModifiedUser":-2,"name":"Epic Systems Corporation","website":"www.epic.com","transparencyAttestationMappings":[{"id":null,"developerId":449,"acbId":1,"acbName":"InfoGard","transparencyAttestation":null},{"id":null,"developerId":449,"acbId":3,"acbName":"Drummond Group Inc.","transparencyAttestation":null},{"id":null,"developerId":449,"acbId":6,"acbName":"ICSA Labs","transparencyAttestation":null}]},"activityDate":1459887759535,"activityObjectId":449,"concept":"ACTIVITY_CONCEPT_DEVELOPER","responsibleUser":{"userId":-2,"subjectName":"admin","firstName":"Administrator","lastName":"Administrator","email":"info@ainq.com","phoneNumber":"(301) 560-6999","title":null,"complianceTermsAccepted":true,"accountLocked":false,"accountEnabled":true,"hash":null}}]
                mockCommonService.productActivity = [{"id":35,"description":"Product 4medica iEHR® Cloud Ambulatory Solution mark 2 was updated.","originalData":{"id":28,"creationDate":1459774932119,"deleted":false,"lastModifiedDate":1459774932119,"lastModifiedUser":-1,"name":"4medica iEHR® Cloud Ambulatory Solution","productVersions":[],"reportFileLocation":null,"developerId":3},"newData":{"id":28,"creationDate":1459774932119,"deleted":false,"lastModifiedDate":1460031909756,"lastModifiedUser":-2,"name":"4medica iEHR® Cloud Ambulatory Solution mark 2","productVersions":[],"reportFileLocation":null,"developerId":3},"activityDate":1460031909812,"activityObjectId":28,"concept":"ACTIVITY_CONCEPT_PRODUCT","responsibleUser":{"userId":-2,"subjectName":"admin","firstName":"Administrator","lastName":"Administrator","email":"info@ainq.com","phoneNumber":"(301) 560-6999","title":null,"complianceTermsAccepted":true,"accountLocked":false,"accountEnabled":true,"hash":null}},{"id":64,"description":"Merged 2 products into new product 'EpicCare Ambulatory - Core EMR'.","originalData":[{"id":679,"creationDate":1459774933163,"deleted":false,"lastModifiedDate":1460392125188,"lastModifiedUser":-1,"name":"EpicCare Ambulatory - Core EMR","productVersions":[],"reportFileLocation":null,"developerId":1643},{"id":680,"creationDate":1459774933164,"deleted":false,"lastModifiedDate":1460392125188,"lastModifiedUser":-1,"name":"EpicCare Ambulatory 2014 Certified EHR Suite","productVersions":[],"reportFileLocation":null,"developerId":1643}],"newData":{"id":2580,"creationDate":1460403065761,"deleted":false,"lastModifiedDate":1460403065761,"lastModifiedUser":-2,"name":"EpicCare Ambulatory - Core EMR","productVersions":[],"reportFileLocation":null,"developerId":1643},"activityDate":1460403065951,"activityObjectId":2580,"concept":"ACTIVITY_CONCEPT_PRODUCT","responsibleUser":{"userId":-2,"subjectName":"admin","firstName":"Administrator","lastName":"Administrator","email":"info@ainq.com","phoneNumber":"(301) 560-6999","title":null,"complianceTermsAccepted":true,"accountLocked":false,"accountEnabled":true,"hash":null}},{"id":68,"description":"Merged 5 products into new product 'ABELMed EHR - EMR / PM'.","originalData":[{"id":34,"creationDate":1459774932130,"deleted":false,"lastModifiedDate":1460403749395,"lastModifiedUser":-1,"name":"ABELMed EHR - EMR / PM","productVersions":[],"reportFileLocation":null,"developerId":1645},{"id":35,"creationDate":1459774932132,"deleted":false,"lastModifiedDate":1460403749395,"lastModifiedUser":-1,"name":"ABELMed EHR-EMR / PM","productVersions":[],"reportFileLocation":null,"developerId":1645},{"id":37,"creationDate":1459774932137,"deleted":false,"lastModifiedDate":1460403749395,"lastModifiedUser":-1,"name":"ABELMed EHR-EMR / PM","productVersions":[],"reportFileLocation":null,"developerId":1645},{"id":33,"creationDate":1459774932128,"deleted":false,"lastModifiedDate":1460403749395,"lastModifiedUser":-1,"name":"ABELMed EHR-EMR/PM","productVersions":[],"reportFileLocation":null,"developerId":1645},{"id":36,"creationDate":1459774932134,"deleted":false,"lastModifiedDate":1460403749395,"lastModifiedUser":-1,"name":"ABELMed EHR-EMR/PM","productVersions":[],"reportFileLocation":null,"developerId":1645}],"newData":{"id":2581,"creationDate":1460403841754,"deleted":false,"lastModifiedDate":1460403841754,"lastModifiedUser":-2,"name":"ABELMed EHR - EMR / PM","productVersions":[],"reportFileLocation":null,"developerId":1645},"activityDate":1460403841881,"activityObjectId":2581,"concept":"ACTIVITY_CONCEPT_PRODUCT","responsibleUser":{"userId":-2,"subjectName":"admin","firstName":"Administrator","lastName":"Administrator","email":"info@ainq.com","phoneNumber":"(301) 560-6999","title":null,"complianceTermsAccepted":true,"accountLocked":false,"accountEnabled":true,"hash":null}},{"id":74,"description":"Product RAPID was updated.","originalData":{"id":41,"creationDate":1459774932143,"deleted":false,"lastModifiedDate":1459774932143,"lastModifiedUser":-1,"name":"RAPID","productVersions":[],"reportFileLocation":null,"developerId":14},"newData":{"id":41,"creationDate":1459774932143,"deleted":false,"lastModifiedDate":1460469060127,"lastModifiedUser":4,"name":"RAPID","productVersions":[],"reportFileLocation":null,"developerId":13},"activityDate":1460469060149,"activityObjectId":41,"concept":"ACTIVITY_CONCEPT_PRODUCT","responsibleUser":{"userId":4,"subjectName":"icsa","firstName":"IC","lastName":"SA","email":"alarned@ainq.com","phoneNumber":"123-123-1234","title":null,"complianceTermsAccepted":true,"accountLocked":false,"accountEnabled":true,"hash":null}},{"id":75,"description":"Product RAPID2 was updated.","originalData":{"id":41,"creationDate":1459774932143,"deleted":false,"lastModifiedDate":1460469060110,"lastModifiedUser":4,"name":"RAPID","productVersions":[],"reportFileLocation":null,"developerId":13},"newData":{"id":41,"creationDate":1459774932143,"deleted":false,"lastModifiedDate":1460469400586,"lastModifiedUser":4,"name":"RAPID2","productVersions":[],"reportFileLocation":null,"developerId":13},"activityDate":1460469400596,"activityObjectId":41,"concept":"ACTIVITY_CONCEPT_PRODUCT","responsibleUser":{"userId":4,"subjectName":"icsa","firstName":"IC","lastName":"SA","email":"alarned@ainq.com","phoneNumber":"123-123-1234","title":null,"complianceTermsAccepted":true,"accountLocked":false,"accountEnabled":true,"hash":null}},{"id":101,"description":"Product EpicCare Ambulatory 2014 Certified EHR Suite was created.","originalData":null,"newData":{"id":2582,"creationDate":1460490245680,"deleted":false,"lastModifiedDate":1460490245680,"lastModifiedUser":4,"name":"EpicCare Ambulatory 2014 Certified EHR Suite","productVersions":[],"reportFileLocation":"https://www.icsalabs.com/sites/default/files/2014-EHRA228012-2014-1113-01.pdf","developerId":1646,"developerName":null},"activityDate":1460490245802,"activityObjectId":2582,"concept":"ACTIVITY_CONCEPT_PRODUCT","responsibleUser":{"userId":4,"subjectName":"icsa","firstName":"IC","lastName":"SA","email":"alarned@ainq.com","phoneNumber":"123-123-1234","title":null,"complianceTermsAccepted":true,"accountLocked":false,"accountEnabled":true,"hash":null}},{"id":81,"description":"Product RAPID was updated.","originalData":{"id":41,"creationDate":1459774932143,"deleted":false,"lastModifiedDate":1460469400583,"lastModifiedUser":4,"name":"RAPID2","productVersions":[],"reportFileLocation":null,"developerId":13,"developerName":"ACOM Health"},"newData":{"id":41,"creationDate":1459774932143,"deleted":false,"lastModifiedDate":1460475527178,"lastModifiedUser":-2,"name":"RAPID","productVersions":[],"reportFileLocation":null,"developerId":14,"developerName":"ACOM Health, Division of ACOM Solutions, Inc."},"activityDate":1460475527299,"activityObjectId":41,"concept":"ACTIVITY_CONCEPT_PRODUCT","responsibleUser":{"userId":-2,"subjectName":"admin","firstName":"Administrator","lastName":"Administrator","email":"info@ainq.com","phoneNumber":"(301) 560-6999","title":null,"complianceTermsAccepted":true,"accountLocked":false,"accountEnabled":true,"hash":null}},{"id":106,"description":"Product EpicCare Ambulatory 2014 Certified EHR Suite was created.","originalData":null,"newData":{"id":2583,"creationDate":1460490473371,"deleted":false,"lastModifiedDate":1460490473371,"lastModifiedUser":4,"name":"EpicCare Ambulatory 2014 Certified EHR Suite","productVersions":[],"reportFileLocation":"https://www.icsalabs.com/sites/default/files/2014-EHRA228012-2014-1113-01.pdf","developerId":1647,"developerName":null},"activityDate":1460490473375,"activityObjectId":2583,"concept":"ACTIVITY_CONCEPT_PRODUCT","responsibleUser":{"userId":4,"subjectName":"icsa","firstName":"IC","lastName":"SA","email":"alarned@ainq.com","phoneNumber":"123-123-1234","title":null,"complianceTermsAccepted":true,"accountLocked":false,"accountEnabled":true,"hash":null}},{"id":110,"description":"Product EpicCare Ambulatory 2014 Certified EHR Suite was created.","originalData":null,"newData":{"id":2584,"creationDate":1460490853739,"deleted":false,"lastModifiedDate":1460490853739,"lastModifiedUser":4,"name":"EpicCare Ambulatory 2014 Certified EHR Suite","productVersions":[],"reportFileLocation":"https://www.icsalabs.com/sites/default/files/2014-EHRA228012-2014-1113-01.pdf","developerId":1648,"developerName":null},"activityDate":1460490853744,"activityObjectId":2584,"concept":"ACTIVITY_CONCEPT_PRODUCT","responsibleUser":{"userId":4,"subjectName":"icsa","firstName":"IC","lastName":"SA","email":"alarned@ainq.com","phoneNumber":"123-123-1234","title":null,"complianceTermsAccepted":true,"accountLocked":false,"accountEnabled":true,"hash":null}},{"id":116,"description":"Product EpicCare Ambulatory 2014 Certified EHR Suite was created.","originalData":null,"newData":{"id":2585,"creationDate":1460491063950,"deleted":false,"lastModifiedDate":1460491063950,"lastModifiedUser":4,"name":"EpicCare Ambulatory 2014 Certified EHR Suite","productVersions":[],"reportFileLocation":"http://www.attestationsample.com","developerId":1649,"developerName":null},"activityDate":1460491063955,"activityObjectId":2585,"concept":"ACTIVITY_CONCEPT_PRODUCT","responsibleUser":{"userId":4,"subjectName":"icsa","firstName":"IC","lastName":"SA","email":"alarned@ainq.com","phoneNumber":"123-123-1234","title":null,"complianceTermsAccepted":true,"accountLocked":false,"accountEnabled":true,"hash":null}}];
                mockCommonService.versionActivity = ['Version 1', 'Version 2'];
                mockCommonService.certBodyActivity  = ['CB 1', 'CB 2'];
                mockCommonService.cpActivity = [
                    {"id":116,"description":"Corrective action plan for CHP-028100 was created.","originalData":null,"newData":{"id":1,"certifiedProductId":7085,"surveillanceStartDate":1459900800000,"surveillanceEndDate":null,"surveillanceResult":false,"nonComplianceDeterminationDate":1460678400000,"approvalDate":null,"startDate":null,"requiredCompletionDate":null,"actualCompletionDate":null,"summary":"Summary","developerExplanation":null,"resolution":null},"activityDate":1461612293311,"activityObjectId":1,"concept":"ACTIVITY_CONCEPT_CERTIFIED_PRODUCT"},
                    {"id":117,"description":"Corrective action plan for CHP-028100 was created.","originalData":null,"newData":{"id":2,"certifiedProductId":7085,"surveillanceStartDate":1459382400000,"surveillanceEndDate":null,"surveillanceResult":false,"nonComplianceDeterminationDate":1460505600000,"approvalDate":null,"startDate":null,"requiredCompletionDate":null,"actualCompletionDate":null,"summary":null,"developerExplanation":null,"resolution":null},"activityDate":1461612309431,"activityObjectId":2,"concept":"ACTIVITY_CONCEPT_CERTIFIED_PRODUCT"}
                ];
                mockCommonService.userActivity = [];
                mockCommonService.userActivities = [];
                mockCommonService.apiActivity = [];
                mockCommonService.apiUserActivity = [];
                mockCommonService.announcementActivity = [];

                mockCommonService.simpleApiCall = function () {
                    var defer = $q.defer();
                    defer.resolve({
                        cols:[{type:'string'}],
                        rows:[]
                    });
                    return defer.promise;
                };

                mockCommonService.externalApiCall = function () {
                    var defer = $q.defer();
                    defer.resolve({
                        cols:[{type:'string'}],
                        rows:[]
                    });
                    return defer.promise;
                };

                mockCommonService.getCertifiedProductActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.cpActivity);
                    return defer.promise;
                };

                mockCommonService.getProductActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.productActivity);
                    return defer.promise;
                };

                mockCommonService.getVersionActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.versionActivity);
                    return defer.promise;
                };

                mockCommonService.getDeveloperActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.developerActivity);
                    return defer.promise;
                };

                mockCommonService.getAcbActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.certBodyActivity);
                    return defer.promise;
                };

                mockCommonService.getAtlActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.certBodyActivity);
                    return defer.promise;
                };

                mockCommonService.getUserActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.userActivity);
                    return defer.promise;
                };

                mockCommonService.getUserActivities = function () {
                    var defer = $q.defer();
                    defer.resolve(this.userActivities);
                    return defer.promise;
                };

                mockCommonService.getApiActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.apiActivities);
                    return defer.promise;
                };

                mockCommonService.getApiUserActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.apiUserActivities);
                    return defer.promise;
                };

                mockCommonService.getAnnouncementActivity = function () { return $q.when(mockCommonService.announcementActivity); };
                mockCommonService.getApiUsers = function () { return $q.when([]) };

                mockAuthService.isAcbAdmin = function () {
                    return true;
                };

                mockAuthService.isChplAdmin = function () {
                    return true;
                };
            });
        });

        beforeEach(inject(function ($compile, $rootScope, _$log_, $templateCache, $httpBackend) {
            $log = _$log_;
            scope = $rootScope.$new();

            var template = $templateCache.get('app/admin/components/reports.html');
            $templateCache.put('admin/components/reports.html', template);

            element = angular.element('<ai-reports></ai-reports');
            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {

            beforeEach(inject(function ($controller) {
                ctrl = $controller('ReportController', {
                    $scope: scope,
                    $element: null
                });
                scope.$digest();
            }));

            it('should have loaded activity', function () {
                expect(ctrl.searchedCertifiedProducts.length).toBeGreaterThan(0);
            });

            it('should know if the logged in user is ACB and/or CHPL admin', function () {
                expect(ctrl.isAcbAdmin).toBeTruthy();
                expect(ctrl.isChplAdmin).toBeTruthy();
            });
        });
    });
})();
