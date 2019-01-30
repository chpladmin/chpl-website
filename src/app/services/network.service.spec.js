(function () {
    'use strict';

    describe('the Network service', function () {
        var $httpBackend, $log, mock, networkService;

        mock = {};
        mock.editions = ['Edition 1', 'Edition 2'];

        beforeEach(function () {
            angular.mock.module('chpl.services');

            inject(function (_$httpBackend_, _$log_, _networkService_) {
                $log = _$log_;
                networkService = _networkService_;
                $httpBackend = _$httpBackend_;

                $httpBackend.whenGET(/data\/certification_editions/).respond(mock.editions);
            })
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should return a promise with the data if a GET doesn\'t return an object', function () {
            $httpBackend.expectGET(/certified_products\/id\/details/).respond(200, 'response');
            networkService.getProduct('id').then(function (response) {
                response.then(function (reject) {
                    expect(reject).toEqual('response');
                });
            }, function () {
                //noop
            });
            $httpBackend.flush();
        });

        it('should return a promise with the data if a GET responds with a failure', function () {
            $httpBackend.expectGET(/certified_products\/id\/details/).respond(500, 'response');
            networkService.getProduct('id').then(function (response) {
                response.then(function (reject) {
                    expect(reject).toEqual('response');
                });
            }, function () {
                //noop
            });
            $httpBackend.flush();
        });

        it('should return a promise with the data if a POST doesn\'t return an object', function () {
            $httpBackend.expectPOST(/certified_products\/pending\/id\/confirm/).respond(200, 'response');
            networkService.confirmPendingCp({id: 'id'}).then(function (response) {
                response.then(function (reject) {
                    expect(reject).toEqual('response');
                });
            }, function () {
                //noop
            });
            $httpBackend.flush();
        });

        it('should return a promise with the data if a POST responds with a failure', function () {
            $httpBackend.expectPOST(/certified_products\/pending\/id\/confirm/).respond(500, 'response');
            networkService.confirmPendingCp({id: 'id'}).then(function (response) {
                response.then(function (reject) {
                    expect(reject).toEqual('response');
                });
            }, function () {
                //noop
            });
            $httpBackend.flush();
        });

        it('should return a promise with the data if a PUT doesn\'t return an object', function () {
            $httpBackend.expectPUT(/announcements\/id/).respond(200, 'response');
            networkService.modifyAnnouncement({id: 'id'}).then(function (response) {
                response.then(function (reject) {
                    expect(reject).toEqual('response');
                });
            }, function () {
                //noop
            });
            $httpBackend.flush();
        });

        it('should return a promise with the data if a PUT responds with a failure', function () {
            $httpBackend.expectPUT(/announcements\/id/).respond(500, 'response');
            networkService.modifyAnnouncement({id: 'id'}).then(function (response) {
                response.then(function (reject) {
                    expect(reject).toEqual('response');
                });
            }, function () {
                //noop
            });
            $httpBackend.flush();
        });

        it('should return a promise with the data if a DELETE responds with a failure', function () {
            $httpBackend.expectDELETE(/schedules\/triggers\/CacheStatusAgeTrigger\/something/).respond(500, 'response');
            networkService.deleteScheduleTrigger({
                group: 'CacheStatusAgeTrigger',
                name: 'something',
            }).then(function (response) {
                response.then(function (reject) {
                    expect(reject).toEqual('response');
                });
            }, function () {
                //noop
            });
            $httpBackend.flush();
        });

        it('should addRole', function () {
            $httpBackend.expectPOST(/^\/rest\/users\/name\/roles\/role$/).respond(200, {data: 'response'});
            networkService.addRole({subjectName: 'name', role: 'role'}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should authorizeUser', function () {
            $httpBackend.expectPOST(/^\/rest\/users\/username\/authorize$/, 'payload').respond(200, {data: 'response'});
            networkService.authorizeUser('payload', 'username').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should changePassword', function () {
            $httpBackend.expectPOST(/^\/rest\/auth\/change_password$/).respond(200, {data: 'response'});
            networkService.changePassword({userName: '', oldPassword: 'password', newPassword: 'newPassword'}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectPOST(/^\/rest\/auth\/change_expired_password$/).respond(200, {data: 'response'});
            networkService.changePassword({userName: 'userName', oldPassword: 'password', newPassword: 'newPassword'}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should confirmPendingCp', function () {
            $httpBackend.expectPOST(/^\/rest\/certified_products\/pending\/id\/confirm$/).respond(200, {data: 'response'});
            networkService.confirmPendingCp({id: 'id'}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should confirmPendingSurveillance', function () {
            $httpBackend.expectPOST(/^\/rest\/surveillance\/pending\/confirm$/).respond(200, {data: 'response'});
            networkService.confirmPendingSurveillance('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should confirmUser', function () {
            $httpBackend.expectPOST(/^\/rest\/users\/confirm$/).respond(200, {data: 'response'});
            networkService.confirmUser('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should createACB', function () {
            $httpBackend.expectPOST(/^\/rest\/acbs$/).respond(200, {data: 'response'});
            networkService.createACB('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should createATL', function () {
            $httpBackend.expectPOST(/^\/rest\/atls$/).respond(200, {data: 'response'});
            networkService.createATL('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should createAnnouncement', function () {
            $httpBackend.expectPOST(/^\/rest\/announcements$/).respond(200, {data: 'response'});
            networkService.createAnnouncement('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should createCmsId', () => {
            $httpBackend.expectPOST(/^\/rest\/certification_ids\?ids=1,2,3$/).respond(200, {data: 'response'});
            networkService.createCmsId([1, 2, 3]).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should createInvitedUser', function () {
            $httpBackend.expectPOST(/^\/rest\/users\/create$/).respond(200, {data: 'response'});
            networkService.createInvitedUser('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        ('should createScheduleOneTimeTrigger', function () {
            $httpBackend.expectPOST(/^\/rest\/users\/create$/).respond(200, {data: 'response'});
            networkService.createScheduleOneTimeTrigger('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should createScheduleTrigger', function () {
            $httpBackend.expectPOST(/^\/rest\/schedules\/triggers$/).respond(200, {data: 'response'});
            networkService.createScheduleTrigger({email: 'something'}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should deleteAnnouncement', function () {
            $httpBackend.expectDELETE(/^\/rest\/announcements\/1$/).respond(200);
            networkService.deleteAnnouncement(1).then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should deleteScheduleTrigger', function () {
            $httpBackend.expectDELETE(/^\/rest\/schedules\/triggers\/CacheStatusAgeTrigger\/something$/).respond(200);
            networkService.deleteScheduleTrigger({
                group: 'CacheStatusAgeTrigger',
                name: 'something',
            }).then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should deleteSurveillance', function () {
            $httpBackend.expectDELETE(/^\/rest\/surveillance\/1$/).respond(200);
            networkService.deleteSurveillance(1,'changeReason').then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should deleteSurveillanceDocument', function () {
            $httpBackend.expectDELETE(/^\/rest\/surveillance\/1\/document\/3$/).respond(200);
            networkService.deleteSurveillanceDocument(1, 3).then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should deleteUser', function () {
            $httpBackend.expectDELETE(/^\/rest\/users\/1$/).respond(200);
            networkService.deleteUser(1).then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should getAcbActivity', function () {
            var aDate = new Date();
            $httpBackend.expectGET(/^\/rest\/activity\/acbs$/).respond(200, {data: 'response'});
            networkService.getAcbActivity({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/acbs\?start=\d+$/).respond(200, {data: 'response'});
            networkService.getAcbActivity({startDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/acbs\?end=\d+$/).respond(200, {data: 'response'});
            networkService.getAcbActivity({endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/acbs\?start=\d+&end=\d+$/).respond(200, {data: 'response'});
            networkService.getAcbActivity({startDate: aDate, endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAcbs', function () {
            $httpBackend.expectGET(/^\/rest\/acbs\?editable=false$/).respond(200, {data: 'response'});
            networkService.getAcbs(false).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAccessibilityStandards', function () {
            $httpBackend.expectGET(/^\/rest\/data\/accessibility_standards$/).respond(200, {data: 'response'});
            networkService.getAccessibilityStandards().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAgeRanges', function () {
            $httpBackend.expectGET(/^\/rest\/data\/age_ranges$/).respond(200, {data: 'response'});
            networkService.getAgeRanges().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAll', function () {
            $httpBackend.expectGET(/^\/rest\/collections\/certified_products$/).respond(200, {data: 'response'});
            networkService.getAll().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAnnouncement', function () {
            $httpBackend.expectGET(/^\/rest\/announcements\/payload$/).respond(200, {data: 'response'});
            networkService.getAnnouncement('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAnnouncementActivity', function () {
            var aDate = new Date();
            $httpBackend.expectGET(/^\/rest\/activity\/announcements$/).respond(200, {data: 'response'});
            networkService.getAnnouncementActivity({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/announcements\?start=\d+$/).respond(200, {data: 'response'});
            networkService.getAnnouncementActivity({startDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/announcements\?end=\d+$/).respond(200, {data: 'response'});
            networkService.getAnnouncementActivity({endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/announcements\?start=\d+&end=\d+$/).respond(200, {data: 'response'});
            networkService.getAnnouncementActivity({startDate: aDate, endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAnnouncements', function () {
            $httpBackend.expectGET(/^\/rest\/announcements\?future=payload$/).respond(200, {data: 'response'});
            networkService.getAnnouncements('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getApiActivity', function () {
            $httpBackend.expectGET(/^\/rest\/key\/activity$/).respond(200, {data: 'response'});
            networkService.getApiActivity({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/key\/activity\?pageNumber=1&pageSize=2&start=\d+&end=\d+&dateAscending=true&filter=!apiKeyFilter$/).respond(200, {data: 'response'});
            networkService.getApiActivity({
                pageNumber: 1,
                pageSize: 2,
                startDate: new Date(),
                endDate: new Date(),
                dateAscending: true,
                filter: 'apiKeyFilter',
            }).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/key\/activity\?filter=apiKeyFilter$/).respond(200, {data: 'response'});
            networkService.getApiActivity({
                filter: 'apiKeyFilter',
                showOnly: true,
            }).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getApiDocumentationDate', () => {
            $httpBackend.expectGET(/^\/rest\/files\/api_documentation\/details$/).respond(200, {data: 'response'});
            networkService.getApiDocumentationDate().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getApiUserActivity', function () {
            var aDate = new Date();
            $httpBackend.expectGET(/^\/rest\/activity\/api_keys$/).respond(200, {data: 'response'});
            networkService.getApiUserActivity({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/api_keys\?start=\d+$/).respond(200, {data: 'response'});
            networkService.getApiUserActivity({startDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/api_keys\?end=\d+$/).respond(200, {data: 'response'});
            networkService.getApiUserActivity({endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/api_keys\?start=\d+&end=\d+$/).respond(200, {data: 'response'});
            networkService.getApiUserActivity({startDate: aDate, endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getApiUsers', function () {
            $httpBackend.expectGET(/^\/rest\/key$/).respond(200, {data: 'response'});
            networkService.getApiUsers().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAtlActivity', function () {
            var aDate = new Date();
            $httpBackend.expectGET(/^\/rest\/activity\/atls$/).respond(200, {data: 'response'});
            networkService.getAtlActivity({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/atls\?start=\d+$/).respond(200, {data: 'response'});
            networkService.getAtlActivity({startDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/atls\?end=\d+$/).respond(200, {data: 'response'});
            networkService.getAtlActivity({endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/atls\?start=\d+&end=\d+$/).respond(200, {data: 'response'});
            networkService.getAtlActivity({startDate: aDate, endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAtls', function () {
            $httpBackend.expectGET(/^\/rest\/atls\?editable=false$/).respond(200, {data: 'response'});
            networkService.getAtls(false).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getCertBodies', function () {
            $httpBackend.expectGET(/^\/rest\/data\/certification_bodies$/).respond(200, {data: 'response'});
            networkService.getCertBodies().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getCertificationStatuses', function () {
            $httpBackend.expectGET(/^\/rest\/data\/certification_statuses$/).respond(200, {data: 'response'});
            networkService.getCertificationStatuses().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getCertifiedProductActivity', function () {
            var aDate = new Date();
            $httpBackend.expectGET(/^\/rest\/activity\/certified_products$/).respond(200, {data: 'response'});
            networkService.getCertifiedProductActivity({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/certified_products\?start=\d+$/).respond(200, {data: 'response'});
            networkService.getCertifiedProductActivity({startDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/certified_products\?end=\d+$/).respond(200, {data: 'response'});
            networkService.getCertifiedProductActivity({endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/certified_products\?start=\d+&end=\d+$/).respond(200, {data: 'response'});
            networkService.getCertifiedProductActivity({startDate: aDate, endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getCmsId', () => {
            $httpBackend.expectGET(/^\/rest\/certification_ids\/key\?includeCriteria=false$/).respond(200, {data: 'response'});
            networkService.getCmsId('key').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/certification_ids\/key\?includeCriteria=true$/).respond(200, {data: 'response'});
            networkService.getCmsId('key', true).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getCmsIds', () => {
            $httpBackend.expectGET(/^\/rest\/certification_ids\/search\?ids=ids$/).respond(200, {data: 'response'});
            networkService.getCmsIds('ids').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getCorrectiveActionPlanActivity', function () {
            var aDate = new Date();
            $httpBackend.expectGET(/^\/rest\/activity\/corrective_action_plans$/).respond(200, {data: 'response'});
            networkService.getCorrectiveActionPlanActivity({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/corrective_action_plans\?start=\d+$/).respond(200, {data: 'response'});
            networkService.getCorrectiveActionPlanActivity({startDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/corrective_action_plans\?end=\d+$/).respond(200, {data: 'response'});
            networkService.getCorrectiveActionPlanActivity({endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/corrective_action_plans\?start=\d+&end=\d+$/).respond(200, {data: 'response'});
            networkService.getCorrectiveActionPlanActivity({startDate: aDate, endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getCriterionProductStatistics', function () {
            $httpBackend.expectGET(/^\/rest\/statistics\/criterion_product$/).respond(200, {data: 'response'});
            networkService.getCriterionProductStatistics().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getCmsDownload', function () {
            $httpBackend.expectGET(/^\/rest\/certification_ids$/).respond(200, {data: 'response'});
            networkService.getCmsDownload().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getCollection', function () {
            $httpBackend.expectGET(/^\/rest\/collections\/certified_products\?fields=id,edition,developer,product,version,chplProductNumber,certificationStatus,criteriaMet,apiDocumentation,transparencyAttestationUrl$/).respond(200, {data: 'response'});
            networkService.getCollection('apiDocumentation').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/decertifications\/developers$/).respond(200, {data: 'response'});
            networkService.getCollection('bannedDevelopers').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/collections\/certified_products\?fields=id,edition,developer,product,version,chplProductNumber,certificationStatus,acb,surveillanceCount,openNonconformityCount,closedNonconformityCount$/).respond(200, {data: 'response'});
            networkService.getCollection('correctiveAction').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/collections\/certified_products\?fields=id,edition,developer,product,version,chplProductNumber,acb,decertificationDate,certificationStatus,numMeaningfulUse,numMeaningfulUseDate$/).respond(200, {data: 'response'});
            networkService.getCollection('decertifiedProducts').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/collections\/certified_products\?fields=id,edition,developer,product,version,chplProductNumber,acb,decertificationDate,certificationStatus,numMeaningfulUse,numMeaningfulUseDate$/).respond(200, {data: 'response'});
            networkService.getCollection('inactiveCertificates').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/collections\/certified_products\?fields=id,edition,developer,product,version,chplProductNumber,acb,certificationStatus,criteriaMet$/).respond(200, {data: 'response'});
            networkService.getCollection('sed').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/collections\/developers$/).respond(200, {data: 'response'});
            networkService.getCollection('transparencyAttestations').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getDeveloper', function () {
            $httpBackend.expectGET(/^\/rest\/developers\/payload$/).respond(200, {data: 'response'});
            networkService.getDeveloper('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getDeveloperActivity', function () {
            var aDate = new Date();
            $httpBackend.expectGET(/^\/rest\/activity\/developers$/).respond(200, {data: 'response'});
            networkService.getDeveloperActivity({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/developers\?start=\d+$/).respond(200, {data: 'response'});
            networkService.getDeveloperActivity({startDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/developers\?end=\d+$/).respond(200, {data: 'response'});
            networkService.getDeveloperActivity({endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/developers\?start=\d+&end=\d+$/).respond(200, {data: 'response'});
            networkService.getDeveloperActivity({startDate: aDate, endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getDevelopers', function () {
            $httpBackend.expectGET(/^\/rest\/developers$/).respond(200, {data: 'response'});
            networkService.getDevelopers().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/developers\?showDeleted=true$/).respond(200, {data: 'response'});
            networkService.getDevelopers(true).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getEditions', function () {
            $httpBackend.expectGET(/^\/rest\/data\/certification_editions$/).respond(200, {data: 'response'});
            networkService.getEditions().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getEducation', function () {
            $httpBackend.expectGET(/^\/rest\/data\/education_types$/).respond(200, {data: 'response'});
            networkService.getEducation().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getFuzzyTypes', function () {
            $httpBackend.expectGET(/^\/rest\/data\/fuzzy_choices$/).respond(200, {data: 'response'});
            networkService.getFuzzyTypes().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getIncumbentDeveloperStatistics', function () {
            $httpBackend.expectGET(/^\/rest\/statistics\/incumbent_developers$/).respond(200, {data: 'response'});
            networkService.getIncumbentDevelopersStatistics().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getJobTypes', function () {
            $httpBackend.expectGET(/^\/rest\/data\/job_types$/).respond(200, {data: 'response'});
            networkService.getJobTypes().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getJobs', function () {
            $httpBackend.expectGET(/^\/rest\/jobs$/).respond(200, {data: 'response'});
            networkService.getJobs().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getIcsFamily', function () {
            $httpBackend.expectGET(/^\/rest\/certified_products\/id\/ics_relationships$/).respond(200, {data: 'response'});
            networkService.getIcsFamily('id').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getListingCountStatistics', function () {
            $httpBackend.expectGET(/^\/rest\/statistics\/listing_count$/).respond(200, {data: 'response'});
            networkService.getListingCountStatistics().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getNonconformityStatisticsCount', function () {
            $httpBackend.expectGET(/^\/rest\/statistics\/nonconformity_criteria_count$/).respond(200, {data: 'response'});
            networkService.getNonconformityStatisticsCount().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getParticipantAgeStatistics', function () {
            $httpBackend.expectGET(/^\/rest\/statistics\/participant_age_count$/).respond(200, {data: 'response'});
            networkService.getParticipantAgeStatistics().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getParticipantComputerExperienceStatistics', function () {
            $httpBackend.expectGET(/^\/rest\/statistics\/participant_computer_experience_count$/).respond(200, {data: 'response'});
            networkService.getParticipantComputerExperienceStatistics().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getParticipantEducationStatistics', function () {
            $httpBackend.expectGET(/^\/rest\/statistics\/participant_education_count$/).respond(200, {data: 'response'});
            networkService.getParticipantEducationStatistics().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getParticipantGenderStatistics', function () {
            $httpBackend.expectGET(/^\/rest\/statistics\/participant_gender_count$/).respond(200, {data: 'response'});
            networkService.getParticipantGenderStatistics().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getParticipantProductExperienceStatistics', function () {
            $httpBackend.expectGET(/^\/rest\/statistics\/participant_product_experience_count$/).respond(200, {data: 'response'});
            networkService.getParticipantProductExperienceStatistics().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getParticipantProfessionalExperienceStatistics', function () {
            $httpBackend.expectGET(/^\/rest\/statistics\/participant_professional_experience_count$/).respond(200, {data: 'response'});
            networkService.getParticipantProfessionalExperienceStatistics().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getPractices', function () {
            $httpBackend.expectGET(/^\/rest\/data\/practice_types$/).respond(200, {data: 'response'});
            networkService.getPractices().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getProduct', function () {
            $httpBackend.expectGET(/^\/rest\/certified_products\/payload\/details$/).respond(200, {data: 'response'});
            networkService.getProduct('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getProductActivity', function () {
            var aDate = new Date();
            $httpBackend.expectGET(/^\/rest\/activity\/products$/).respond(200, {data: 'response'});
            networkService.getProductActivity({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/products\?start=\d+$/).respond(200, {data: 'response'});
            networkService.getProductActivity({startDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/products\?end=\d+$/).respond(200, {data: 'response'});
            networkService.getProductActivity({endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/products\?start=\d+&end=\d+$/).respond(200, {data: 'response'});
            networkService.getProductActivity({startDate: aDate, endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getProductsByDeveloper', function () {
            $httpBackend.expectGET(/^\/rest\/products\?developerId=payload$/).respond(200, {data: 'response'});
            networkService.getProductsByDeveloper('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getProductsByVersion', function () {
            $httpBackend.expectGET(/^\/rest\/certified_products\?versionId=payload&editable=p2$/).respond(200, {data: 'response'});
            networkService.getProductsByVersion('payload', 'p2').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getQmsStandards', function () {
            $httpBackend.expectGET(/^\/rest\/data\/qms_standards$/).respond(200, {data: 'response'});
            networkService.getQmsStandards().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getRelatedListings', function () {
            $httpBackend.expectGET(/^\/rest\/products\/payload\/listings$/).respond(200, {data: 'response'});
            networkService.getRelatedListings('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getSearchOptions', function () {
            $httpBackend.expectGET(/^\/rest\/data\/search_options$/).respond(200, {data: 'response'});
            networkService.getSearchOptions().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getScheduleTriggers', function () {
            $httpBackend.expectGET(/^\/rest\/schedules\/triggers$/).respond(200, {data: 'response'});
            networkService.getScheduleTriggers().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getScheduleJobs', function () {
            $httpBackend.expectGET(/^\/rest\/schedules\/jobs$/).respond(200, {data: 'response'});
            networkService.getScheduleJobs().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getSimpleProduct', function () {
            $httpBackend.expectGET(/^\/rest\/products\/payload$/).respond(200, {data: 'response'});
            networkService.getSimpleProduct('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getSingleCertifiedProductActivity', function () {
            $httpBackend.expectGET(/^\/rest\/activity\/certified_products\/payload$/).respond(200, {data: 'response'});
            networkService.getSingleCertifiedProductActivity('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getSedParticipantStatisticsCount', function () {
            $httpBackend.expectGET(/^\/rest\/statistics\/sed_participant_count$/).respond(200, {data: 'response'});
            networkService.getSedParticipantStatisticsCount().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getSurveillanceLookups', function () {
            $httpBackend.expectGET(/^\/rest\/data\/surveillance_types$/).respond(200, {data: 'surveillance_types'});
            $httpBackend.expectGET(/^\/rest\/data\/surveillance_requirement_types$/).respond(200, {data: 'surveillance_requirement_types'});
            $httpBackend.expectGET(/^\/rest\/data\/surveillance_result_types$/).respond(200, {data: 'surveillance_result_types'});
            $httpBackend.expectGET(/^\/rest\/data\/nonconformity_status_types$/).respond(200, {data: 'nonconformity_status_types'});
            $httpBackend.expectGET(/^\/rest\/data\/surveillance_requirements$/).respond(200, {data: 'surveillance_requirements'});
            $httpBackend.expectGET(/^\/rest\/data\/nonconformity_types$/).respond(200, {data: 'nonconformity_types'});
            var response = networkService.getSurveillanceLookups();
            $httpBackend.flush();
            expect(response).toEqual({
                surveillanceTypes: {data: 'surveillance_types'},
                surveillanceRequirementTypes: {data: 'surveillance_requirement_types'},
                surveillanceResultTypes: {data: 'surveillance_result_types'},
                nonconformityStatusTypes: {data: 'nonconformity_status_types'},
                surveillanceRequirements: {data: 'surveillance_requirements'},
                nonconformityTypes: {data: 'nonconformity_types'},
            });
        });

        it('should getTargetedUsers', function () {
            $httpBackend.expectGET(/^\/rest\/data\/targeted_users$/).respond(200, {data: 'response'});
            networkService.getTargetedUsers().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getTestData', function () {
            $httpBackend.expectGET(/^\/rest\/data\/test_data$/).respond(200, {data: 'response'});
            networkService.getTestData().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getTestFunctionality', function () {
            $httpBackend.expectGET(/^\/rest\/data\/test_functionality$/).respond(200, {data: 'response'});
            networkService.getTestFunctionality().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getTestProcedures', function () {
            $httpBackend.expectGET(/^\/rest\/data\/test_procedures$/).respond(200, {data: 'response'});
            networkService.getTestProcedures().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getTestStandards', function () {
            $httpBackend.expectGET(/^\/rest\/data\/test_standards$/).respond(200, {data: 'response'});
            networkService.getTestStandards().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getTestTools', function () {
            $httpBackend.expectGET(/^\/rest\/data\/test_tools$/).respond(200, {data: 'response'});
            networkService.getTestTools().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUcdProcesses', function () {
            $httpBackend.expectGET(/^\/rest\/data\/ucd_processes$/).respond(200, {data: 'response'});
            networkService.getUcdProcesses().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUploadingCps', function () {
            $httpBackend.expectGET(/^\/rest\/certified_products\/pending$/).respond(200, {data: 'response'});
            networkService.getUploadingCps().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUploadingSurveillances', function () {
            $httpBackend.expectGET(/^\/rest\/surveillance\/pending$/).respond(200, {data: 'response'});
            networkService.getUploadingSurveillances().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUploadTemplateVersions', function () {
            $httpBackend.expectGET(/^\/rest\/data\/upload_template_versions$/).respond(200, {data: 'response'});
            networkService.getUploadTemplateVersions().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUserActivitiesActivity', function () {
            var aDate = new Date();
            $httpBackend.expectGET(/^\/rest\/activity\/user_activities$/).respond(200, {data: 'response'});
            networkService.getUserActivities({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/user_activities\?start=\d+$/).respond(200, {data: 'response'});
            networkService.getUserActivities({startDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/user_activities\?end=\d+$/).respond(200, {data: 'response'});
            networkService.getUserActivities({endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/user_activities\?start=\d+&end=\d+$/).respond(200, {data: 'response'});
            networkService.getUserActivities({startDate: aDate, endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUserActivity', function () {
            var aDate = new Date();
            $httpBackend.expectGET(/^\/rest\/activity\/users$/).respond(200, {data: 'response'});
            networkService.getUserActivity({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/users\?start=\d+$/).respond(200, {data: 'response'});
            networkService.getUserActivity({startDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/users\?end=\d+$/).respond(200, {data: 'response'});
            networkService.getUserActivity({endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/users\?start=\d+&end=\d+$/).respond(200, {data: 'response'});
            networkService.getUserActivity({startDate: aDate, endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUserByUsername', function () {
            $httpBackend.expectGET(/^\/rest\/users\/admin\/details$/).respond(200, {data: 'response'});
            networkService.getUserByUsername('admin').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUsers', function () {
            $httpBackend.expectGET(/^\/rest\/users$/).respond(200, {data: 'response'});
            networkService.getUsers().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUsersAtAcb', function () {
            $httpBackend.expectGET(/^\/rest\/acbs\/payload\/users$/).respond(200, {data: 'response'});
            networkService.getUsersAtAcb('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUsersAtAtl', function () {
            $httpBackend.expectGET(/^\/rest\/atls\/payload\/users$/).respond(200, {data: 'response'});
            networkService.getUsersAtAtl('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getVersion', function () {
            $httpBackend.expectGET(/^\/rest\/versions\/payload$/).respond(200, {data: 'response'});
            networkService.getVersion('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getVersionActivity', function () {
            var aDate = new Date();
            $httpBackend.expectGET(/^\/rest\/activity\/versions$/).respond(200, {data: 'response'});
            networkService.getVersionActivity({}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/versions\?start=\d+$/).respond(200, {data: 'response'});
            networkService.getVersionActivity({startDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/versions\?end=\d+$/).respond(200, {data: 'response'});
            networkService.getVersionActivity({endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
            $httpBackend.expectGET(/^\/rest\/activity\/versions\?start=\d+&end=\d+$/).respond(200, {data: 'response'});
            networkService.getVersionActivity({startDate: aDate, endDate: aDate}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getVersionsByProduct', function () {
            $httpBackend.expectGET(/^\/rest\/versions\?productId=payload$/).respond(200, {data: 'response'});
            networkService.getVersionsByProduct('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should initiateSurveillance', function () {
            $httpBackend.expectPOST(/^\/rest\/surveillance$/).respond(200, {data: 'response'});
            networkService.initiateSurveillance('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should inviteUser', function () {
            $httpBackend.expectPOST(/^\/rest\/users\/invite$/).respond(200, {data: 'response'});
            networkService.inviteUser('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should keepalive', function () {
            $httpBackend.expectGET(/^\/rest\/auth\/keep_alive$/).respond(200, {data: 'response'});
            networkService.keepalive('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should login', function () {
            $httpBackend.expectPOST(/^\/rest\/auth\/authenticate$/).respond(200, {data: 'response'});
            networkService.login('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should lookupCertificationId', function () {
            $httpBackend.expectGET(/^\/rest\/certification_ids\/payload$/).respond(200, {data: 'response'});
            networkService.lookupCertificationId('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should massRejectPendingListings', function () {
            $httpBackend.expectDELETE(/^\/rest\/certified_products\/pending$/).respond(200);
            networkService.massRejectPendingListings('payload').then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should massRejectPendingSurveillance', function () {
            $httpBackend.expectDELETE(/^\/rest\/surveillance\/pending$/).respond(200);
            networkService.massRejectPendingSurveillance('payload').then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should modifyACB', function () {
            $httpBackend.expectPUT(/^\/rest\/acbs\/id$/).respond(200, {data: 'response'});
            networkService.modifyACB({id: 'id'}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should modifyATL', function () {
            $httpBackend.expectPUT(/^\/rest\/atls\/id$/).respond(200, {data: 'response'});
            networkService.modifyATL({id: 'id'}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should modifyAnnouncement', function () {
            $httpBackend.expectPUT(/^\/rest\/announcements\/id$/).respond(200, {data: 'response'});
            networkService.modifyAnnouncement({id: 'id'}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should registerApi', () => {
            $httpBackend.expectPOST(/^\/rest\/key$/).respond(200, {data: 'response'});
            networkService.registerApi('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should rejectPendingCp', function () {
            $httpBackend.expectDELETE(/^\/rest\/certified_products\/pending\/1$/).respond(200);
            networkService.rejectPendingCp(1).then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should rejectPendingSurveillance', function () {
            $httpBackend.expectDELETE(/^\/rest\/surveillance\/pending\/1$/).respond(200);
            networkService.rejectPendingSurveillance(1).then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should removeUserFromAcb', function () {
            $httpBackend.expectDELETE(/^\/rest\/acbs\/2\/users\/1$/).respond(200);
            networkService.removeUserFromAcb(1, 2).then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should removeUserFromAtl', function () {
            $httpBackend.expectDELETE(/^\/rest\/atls\/2\/users\/1$/).respond(200);
            networkService.removeUserFromAtl(1, 2).then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should resetPassword', function () {
            $httpBackend.expectPOST(/^\/rest\/auth\/reset_password_request$/).respond(200, {data: 'response'});
            networkService.resetPassword('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should emailResetPassword', function () {
            $httpBackend.expectPOST(/^\/rest\/auth\/email_reset_password$/).respond(200, {data: 'response'});
            networkService.emailResetPassword('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should revokeApi', function () {
            $httpBackend.expectDELETE(/^\/rest\/key\/userKey$/).respond(200);
            networkService.revokeApi({key: 'userKey'}).then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should revokeRole', function () {
            $httpBackend.expectDELETE(/^\/rest\/users\/name\/roles\/role$/).respond(200);
            networkService.revokeRole({subjectName: 'name', role: 'role'}).then(function (response) {
                expect(response.status).toEqual(200);
            });
            $httpBackend.flush();
        });

        it('should search', function () {
            $httpBackend.expectPOST(/^\/rest\/search$/).respond(200, {data: 'response'});
            networkService.search('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should splitProduct', function () {
            $httpBackend.expectPOST(/^\/rest\/products\/1\/split$/).respond(200, {data: 'response'});
            networkService.splitProduct({oldProduct: {productId: 1}}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateCP', function () {
            $httpBackend.expectPUT(/^\/rest\/certified_products\/id$/).respond(200, {data: 'response'});
            networkService.updateCP({listing: {id: 'id'}, reason: 'none'}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateDeveloper', function () {
            $httpBackend.expectPUT(/^\/rest\/developers$/).respond(200, {data: 'response'});
            networkService.updateDeveloper('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateFuzzyType', function () {
            $httpBackend.expectPUT(/^\/rest\/data\/fuzzy_choices\/3$/).respond(200, {data: 'response'});
            networkService.updateFuzzyType({id: 3}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateJob', function () {
            $httpBackend.expectPUT(/^\/rest\/schedules\/jobs$/).respond(200, {data: 'response'});
            networkService.updateJob('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateProduct', function () {
            $httpBackend.expectPUT(/^\/rest\/products$/).respond(200, {data: 'response'});
            networkService.updateProduct('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateScheduleTrigger', function () {
            $httpBackend.expectPUT(/^\/rest\/schedules\/triggers$/).respond(200, {data: 'response'});
            networkService.updateScheduleTrigger({name: 'something'}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateSurveillance', function () {
            $httpBackend.expectPUT(/^\/rest\/surveillance\/id$/).respond(200, {data: 'response'});
            networkService.updateSurveillance({id: 'id'}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateUser', function () {
            $httpBackend.expectPUT(/^\/rest\/users\/2$/).respond(200, {data: 'response'});
            networkService.updateUser({userId: 2}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateVersion', function () {
            $httpBackend.expectPUT(/^\/rest\/versions$/).respond(200, {data: 'response'});
            networkService.updateVersion('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });
    });
})();
