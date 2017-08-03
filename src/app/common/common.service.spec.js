(function () {
    'use strict';

    describe('the Network service', function () {

        var $httpBackend, $log, commonService, mock;

        mock = {};
        mock.editions = ['Edition 1', 'Edition 2'];

        beforeEach(function () {
            module('chpl.common');

            inject(function (_$httpBackend_, _$log_, _commonService_) {
                $log = _$log_;
                commonService = _commonService_;
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

        it('should addRole', function () {
            $httpBackend.expectPOST(/users\/grant_role/, 'payload').respond(200, {data: 'response'});
            commonService.addRole('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should authorizeUser', function () {
            $httpBackend.expectPOST(/users\/authorize/, 'payload').respond(200, {data: 'response'});
            commonService.authorizeUser('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should changePassword', function () {
            $httpBackend.expectPOST(/auth\/change_password/).respond(200, {data: 'response'});
            commonService.changePassword('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should confirmPendingCp', function () {
            $httpBackend.expectPOST(/certified_products\/pending\/confirm/).respond(200, {data: 'response'});
            commonService.confirmPendingCp('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should confirmPendingSurveillance', function () {
            $httpBackend.expectPOST(/surveillance\/pending\/confirm/).respond(200, {data: 'response'});
            commonService.confirmPendingSurveillance('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should confirmUser', function () {
            $httpBackend.expectPOST(/users\/confirm/).respond(200, {data: 'response'});
            commonService.confirmUser('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should createACB', function () {
            $httpBackend.expectPOST(/acbs\/create/).respond(200, {data: 'response'});
            commonService.createACB('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should createATL', function () {
            $httpBackend.expectPOST(/atls\/create/).respond(200, {data: 'response'});
            commonService.createATL('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should createAnnouncement', function () {
            $httpBackend.expectPOST(/announcements\/create/).respond(200, {data: 'response'});
            commonService.createAnnouncement('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should createInvitedUser', function () {
            $httpBackend.expectPOST(/users\/create/).respond(200, {data: 'response'});
            commonService.createInvitedUser('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should createRecipient', function () {
            $httpBackend.expectPOST(/notifications\/recipients\/create/).respond(200, {data: 'response'});
            commonService.createRecipient('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should deleteACB', function () {
            $httpBackend.expectPOST(/acbs\/1\/delete/).respond(200, {data: 'response'});
            commonService.deleteACB(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should deleteATL', function () {
            $httpBackend.expectPOST(/atls\/1\/delete/).respond(200, {data: 'response'});
            commonService.deleteATL(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should deleteAnnouncement', function () {
            $httpBackend.expectPOST(/announcements\/1\/delete/).respond(200, {data: 'response'});
            commonService.deleteAnnouncement(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should deleteCap', function () {
            $httpBackend.expectPOST(/corrective_action_plan\/1\/delete/).respond(200, {data: 'response'});
            commonService.deleteCap(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should deleteDoc', function () {
            $httpBackend.expectPOST(/corrective_action_plan\/documentation\/1\/delete/).respond(200, {data: 'response'});
            commonService.deleteDoc(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should deleteRecipient', function () {
            $httpBackend.expectPOST(/notifications\/recipients\/1\/delete/).respond(200, {data: 'response'});
            commonService.deleteRecipient({id: 1}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should deleteSurveillance', function () {
            $httpBackend.expectPOST(/surveillance\/1\/delete/).respond(200, {data: 'response'});
            commonService.deleteSurveillance(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should deleteSurveillanceDocument', function () {
            $httpBackend.expectPOST(/surveillance\/1\/nonconformity\/2\/document\/3\/delete/).respond(200, {data: 'response'});
            commonService.deleteSurveillanceDocument(1, 2, 3).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should deleteUser', function () {
            $httpBackend.expectPOST(/users\/1\/delete/).respond(200, {data: 'response'});
            commonService.deleteUser(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getAcbActivity
        // getAcbs

        it('should getAccessibilityStandards', function () {
            $httpBackend.expectGET(/data\/accessibility_standards/).respond(200, {data: 'response'});
            commonService.getAccessibilityStandards().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAgeRanges', function () {
            $httpBackend.expectGET(/data\/age_ranges/).respond(200, {data: 'response'});
            commonService.getAgeRanges().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAll', function () {
            $httpBackend.expectGET(/certified_products/).respond(200, {data: 'response'});
            commonService.getAll().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getAnnouncement', function () {
            $httpBackend.expectGET(/announcements\/payload/).respond(200, {data: 'response'});
            commonService.getAnnouncement('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getAnnouncementActivity

        it('should getAnnouncements', function () {
            $httpBackend.expectGET(/announcements\/\?future=payload/).respond(200, {data: 'response'});
            commonService.getAnnouncements('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getApiactivity
        // getApiUserActivity

        it('should getApiUsers', function () {
            $httpBackend.expectGET(/key\//).respond(200, {data: 'response'});
            commonService.getApiUsers().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getatlactivity
        // getatls

        it('should getCap', function () {
            $httpBackend.expectGET(/corrective_action_plan\/\?certifiedProductId=payload/).respond(200, {data: 'response'});
            commonService.getCap('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getCertBodies', function () {
            $httpBackend.expectGET(/data\/certification_bodies/).respond(200, {data: 'response'});
            commonService.getCertBodies().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getCertificationStatuses', function () {
            $httpBackend.expectGET(/data\/certification_statuses/).respond(200, {data: 'response'});
            commonService.getCertificationStatuses().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getCertifiedProductActivity

        it('should getCmsDownload', function () {
            $httpBackend.expectGET(/certification_ids\//).respond(200, {data: 'response'});
            commonService.getCmsDownload().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getCollection

        it('should getDeveloper', function () {
            $httpBackend.expectGET(/developers\/payload/).respond(200, {data: 'response'});
            commonService.getDeveloper('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getdeveloperactivity
        // getDevelopers

        it('should getEditions', function () {
            $httpBackend.expectGET(/data\/certification_editions/).respond(200, {data: 'response'});
            commonService.getEditions().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getEducation', function () {
            $httpBackend.expectGET(/data\/education_types/).respond(200, {data: 'response'});
            commonService.getEducation().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getMeaningfulUseUsersAccurateAsOfDate', function () {
            $httpBackend.expectGET(/meaningful_use\/accurate_as_of/).respond(200, {data: 'response'});
            commonService.getMeaningfulUseUsersAccurateAsOfDate().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getSubscriptionRecipients', function () {
            $httpBackend.expectGET(/notifications\/recipients/).respond(200, {data: 'response'});
            commonService.getSubscriptionRecipients().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getSubscriptionReportTypes', function () {
            $httpBackend.expectGET(/data\/notification_types/).respond(200, {data: 'response'});
            commonService.getSubscriptionReportTypes().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getPractices', function () {
            $httpBackend.expectGET(/data\/practice_types/).respond(200, {data: 'response'});
            commonService.getPractices().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getProduct', function () {
            $httpBackend.expectGET(/certified_products\/payload\/details/).respond(200, {data: 'response'});
            commonService.getProduct('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getproductactivity

        it('should getProductsByDeveloper', function () {
            $httpBackend.expectGET(/products\/\?developerId=payload/).respond(200, {data: 'response'});
            commonService.getProductsByDeveloper('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getProductsByVersion', function () {
            $httpBackend.expectGET(/certified_products\/\?versionId=payload&editable=p2/).respond(200, {data: 'response'});
            commonService.getProductsByVersion('payload', 'p2').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getQmsStandards', function () {
            $httpBackend.expectGET(/data\/qms_standards/).respond(200, {data: 'response'});
            commonService.getQmsStandards().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getRelatedListings', function () {
            $httpBackend.expectGET(/products\/payload\/listings/).respond(200, {data: 'response'});
            commonService.getRelatedListings('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getSearchOptiosn

        it('should getSimpleProduct', function () {
            $httpBackend.expectGET(/products\/payload/).respond(200, {data: 'response'});
            commonService.getSimpleProduct('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getSingleCertifiedProductActivity', function () {
            $httpBackend.expectGET(/activity\/certified_products\/payload/).respond(200, {data: 'response'});
            commonService.getSingleCertifiedProductActivity('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getsurveillancelookups

        it('should getTargetedUsers', function () {
            $httpBackend.expectGET(/data\/targeted_users/).respond(200, {data: 'response'});
            commonService.getTargetedUsers().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getTestFunctionality', function () {
            $httpBackend.expectGET(/data\/test_functionality/).respond(200, {data: 'response'});
            commonService.getTestFunctionality().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getTestStandards', function () {
            $httpBackend.expectGET(/data\/test_standards/).respond(200, {data: 'response'});
            commonService.getTestStandards().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getTestTools', function () {
            $httpBackend.expectGET(/data\/test_tools/).respond(200, {data: 'response'});
            commonService.getTestTools().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUcdProcesses', function () {
            $httpBackend.expectGET(/data\/ucd_processes/).respond(200, {data: 'response'});
            commonService.getUcdProcesses().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUploadingCps', function () {
            $httpBackend.expectGET(/certified_products\/pending/).respond(200, {data: 'response'});
            commonService.getUploadingCps().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUploadingSurveillances', function () {
            $httpBackend.expectGET(/surveillance\/pending/).respond(200, {data: 'response'});
            commonService.getUploadingSurveillances().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getUserActivities
        // getUserActivity

        it('should getUsers', function () {
            $httpBackend.expectGET(/users/).respond(200, {data: 'response'});
            commonService.getUsers().then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUsersAtAcb', function () {
            $httpBackend.expectGET(/acbs\/payload\/users/).respond(200, {data: 'response'});
            commonService.getUsersAtAcb('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getUsersAtAtl', function () {
            $httpBackend.expectGET(/atls\/payload\/users/).respond(200, {data: 'response'});
            commonService.getUsersAtAtl('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should getVersion', function () {
            $httpBackend.expectGET(/versions\/payload/).respond(200, {data: 'response'});
            commonService.getVersion('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // getVersionActivity

        it('should getVersionsByProduct', function () {
            $httpBackend.expectGET(/versions\/\?productId=payload/).respond(200, {data: 'response'});
            commonService.getVersionsByProduct('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should initiateCap', function () {
            $httpBackend.expectPOST(/corrective_action_plan\/create/).respond(200, {data: 'response'});
            commonService.initiateCap('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should initiateSurveillance', function () {
            $httpBackend.expectPOST(/surveillance\/create/).respond(200, {data: 'response'});
            commonService.initiateSurveillance('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should inviteUser', function () {
            $httpBackend.expectPOST(/users\/invite/).respond(200, {data: 'response'});
            commonService.inviteUser('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should keepalive', function () {
            $httpBackend.expectGET(/auth\/keep_alive/).respond(200, {data: 'response'});
            commonService.keepalive('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should login', function () {
            $httpBackend.expectPOST(/auth\/authenticate/).respond(200, {data: 'response'});
            commonService.login('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should lookupCertificationId', function () {
            $httpBackend.expectGET(/certification_ids\/payload/).respond(200, {data: 'response'});
            commonService.lookupCertificationId('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should massRejectPendingListings', function () {
            $httpBackend.expectPOST(/certified_products\/pending\/reject/).respond(200, {data: 'response'});
            commonService.massRejectPendingListings('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should massRejectPendingSurveillance', function () {
            $httpBackend.expectPOST(/surveillance\/pending\/reject/).respond(200, {data: 'response'});
            commonService.massRejectPendingSurveillance('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should modifyACB', function () {
            $httpBackend.expectPOST(/acbs\/update/).respond(200, {data: 'response'});
            commonService.modifyACB('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should modifyATL', function () {
            $httpBackend.expectPOST(/atls\/update/).respond(200, {data: 'response'});
            commonService.modifyATL('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should modifyAnnouncement', function () {
            $httpBackend.expectPOST(/announcements\/update/).respond(200, {data: 'response'});
            commonService.modifyAnnouncement('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should registerApi', function () {
            $httpBackend.expectPOST(/key\/register/).respond(200, {data: 'response'});
            commonService.registerApi('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should rejectPendingCp', function () {
            $httpBackend.expectPOST(/certified_products\/pending\/1\/reject/).respond(200, {data: 'response'});
            commonService.rejectPendingCp(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should rejectPendingSurveillance', function () {
            $httpBackend.expectPOST(/surveillance\/pending\/1\/reject/).respond(200, {data: 'response'});
            commonService.rejectPendingSurveillance(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should removeUserFromAcb', function () {
            $httpBackend.expectPOST(/acbs\/2\/remove_user\/1/).respond(200, {data: 'response'});
            commonService.removeUserFromAcb(1, 2).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should removeUserFromAtl', function () {
            $httpBackend.expectPOST(/atls\/2\/remove_user\/1/).respond(200, {data: 'response'});
            commonService.removeUserFromAtl(1, 2).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should resetPassword', function () {
            $httpBackend.expectPOST(/auth\/reset_password/).respond(200, {data: 'response'});
            commonService.resetPassword('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should revokeApi', function () {
            $httpBackend.expectPOST(/key\/revoke/).respond(200, {data: 'response'});
            commonService.revokeApi('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should revokeRole', function () {
            $httpBackend.expectPOST(/users\/revoke_role/).respond(200, {data: 'response'});
            commonService.revokeRole('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should search', function () {
            $httpBackend.expectPOST(/search/).respond(200, {data: 'response'});
            commonService.search('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should setMeaningfulUseUsersAccurateAsOfDate', function () {
            $httpBackend.expectPOST(/meaningful_use\/accurate_as_of/).respond(200, {data: 'response'});
            commonService.setMeaningfulUseUsersAccurateAsOfDate('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should splitProduct', function () {
            $httpBackend.expectPOST(/products\/1\/split/).respond(200, {data: 'response'});
            commonService.splitProduct({oldProduct: {productId: 1}}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should undeleteACB', function () {
            $httpBackend.expectPOST(/acbs\/1\/undelete/).respond(200, {data: 'response'});
            commonService.undeleteACB(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should undeleteATL', function () {
            $httpBackend.expectPOST(/atls\/1\/undelete/).respond(200, {data: 'response'});
            commonService.undeleteATL(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should undeleteAnnouncement', function () {
            $httpBackend.expectPOST(/announcements\/1\/undelete/).respond(200, {data: 'response'});
            commonService.undeleteAnnouncement(1).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateCP', function () {
            $httpBackend.expectPOST(/certified_products\/update/).respond(200, {data: 'response'});
            commonService.updateCP('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateCap', function () {
            $httpBackend.expectPOST(/corrective_action_plan\/update/).respond(200, {data: 'response'});
            commonService.updateCap('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateDeveloper', function () {
            $httpBackend.expectPOST(/developers\/update/).respond(200, {data: 'response'});
            commonService.updateDeveloper('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateProduct', function () {
            $httpBackend.expectPOST(/products\/update/).respond(200, {data: 'response'});
            commonService.updateProduct('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateRecipient', function () {
            $httpBackend.expectPOST(/notifications\/recipients\/1\/update/).respond(200, {data: 'response'});
            commonService.updateRecipient({id: 1}).then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateSurveillance', function () {
            $httpBackend.expectPOST(/surveillance\/update/).respond(200, {data: 'response'});
            commonService.updateSurveillance('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateUser', function () {
            $httpBackend.expectPOST(/users\/update/).respond(200, {data: 'response'});
            commonService.updateUser('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        it('should updateVersion', function () {
            $httpBackend.expectPOST(/versions\/update/).respond(200, {data: 'response'});
            commonService.updateVersion('payload').then(function (response) {
                expect(response.data).toEqual('response');
            });
            $httpBackend.flush();
        });

        // old

        it('should return editions', function () {
            commonService.getEditions().then(function (response) {
                expect(response).toEqual(mock.editions);
            });
            $httpBackend.flush();
        });
    });
})();
