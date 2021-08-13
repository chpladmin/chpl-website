(() => {
  describe('the Network service', () => {
    let $httpBackend;
    let $log;
    let networkService;

    const mock = {};
    mock.editions = ['Edition 1', 'Edition 2'];

    beforeEach(() => {
      angular.mock.module('chpl.services');

      inject((_$httpBackend_, _$log_, _networkService_) => {
        $httpBackend = _$httpBackend_;
        $log = _$log_;
        networkService = _networkService_;

        $httpBackend.whenGET(/data\/certification_editions/).respond(mock.editions);
      });
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('for general REST calls', () => {
      it('should return a promise with the data if a GET doesn\'t return an object', () => {
        $httpBackend.expectGET(/certified_products\/id\/details/).respond(200, 'response');
        networkService.getListing('id').then((response) => {
          response.then((reject) => {
            expect(reject).toEqual('response');
          });
        }, () => {
          // noop
        });
        $httpBackend.flush();
      });

      it('should return a promise with the data if a GET responds with a failure', () => {
        $httpBackend.expectGET(/certified_products\/id\/details/).respond(500, 'response');
        networkService.getListing('id').then((response) => {
          response.then((reject) => {
            expect(reject).toEqual('response');
          });
        }, () => {
          // noop
        });
        $httpBackend.flush();
      });

      it('should force a cache refresh when required', () => {
        $httpBackend.expectGET(/^\/rest\/endpoint$/, (headers) => headers['Cache-Control'] === 'no-cache')
          .respond(200, { data: 'response' });
        networkService.apiGET('/endpoint', { forceReload: true }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should not force a cache refresh by default', () => {
        $httpBackend.expectGET(/^\/rest\/endpoint$/, (headers) => headers['Cache-Control'] === undefined)
          .respond(200, { data: 'response' });
        networkService.apiGET('/endpoint').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should not force a cache refresh explicitly', () => {
        $httpBackend.expectGET(/^\/rest\/endpoint$/, (headers) => headers['Cache-Control'] === undefined)
          .respond(200, { data: 'response' });
        networkService.apiGET('/endpoint', { forceReload: false }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should return a promise with the data if a POST doesn\'t return an object', () => {
        $httpBackend.expectPOST(/certified_products\/pending\/1\/beta\/confirm/).respond(200, 'response');
        networkService.confirmPendingCp({ pendingListing: { id: 1 }, warningAcknowledgement: false }).then((response) => {
          response.then((reject) => {
            expect(reject).toEqual('response');
          });
        }, () => {
          // noop
        });
        $httpBackend.flush();
      });

      it('should return a promise with the data if a POST responds with a failure', () => {
        $httpBackend.expectPOST(/certified_products\/pending\/1\/beta\/confirm/).respond(500, 'response');
        networkService.confirmPendingCp({ pendingListing: { id: 1 }, warningAcknowledgement: false }).then((response) => {
          response.then((reject) => {
            expect(reject).toEqual('response');
          });
        }, () => {
          // noop
        });
        $httpBackend.flush();
      });

      it('should return a promise with the data if a PUT doesn\'t return an object', () => {
        $httpBackend.expectPUT(/announcements\/id/).respond(200, 'response');
        networkService.modifyAnnouncement({ id: 'id' }).then((response) => {
          response.then((reject) => {
            expect(reject).toEqual('response');
          });
        }, () => {
          // noop
        });
        $httpBackend.flush();
      });

      it('should return a promise with the data if a PUT responds with a failure', () => {
        $httpBackend.expectPUT(/announcements\/id/).respond(500, 'response');
        networkService.modifyAnnouncement({ id: 'id' }).then((response) => {
          response.then((reject) => {
            expect(reject).toEqual('response');
          });
        }, () => {
          // noop
        });
        $httpBackend.flush();
      });

      it('should return a promise with the data if a DELETE responds with a failure', () => {
        $httpBackend.expectDELETE(/schedules\/triggers\/CacheStatusAgeTrigger\/something/).respond(500, 'response');
        networkService.deleteScheduleTrigger({
          group: 'CacheStatusAgeTrigger',
          name: 'something',
        }).then((response) => {
          response.then((reject) => {
            expect(reject).toEqual('response');
          });
        }, () => {
          // noop
        });
        $httpBackend.flush();
      });
    });

    describe('with respect to caching', () => {
      describe('when getting activity', () => {
        it('should refresh if old', () => {
          networkService.store.activity.types = {
            '/activity/acbs': {
              data: {},
              lastUpdated: new Date('2014-01-01'),
            },
          };
          $httpBackend.expectGET(/^\/rest\/activity\/acbs$/).respond(200, { data: 'response' });
          networkService.getAcbActivity({}).then((response) => {
            expect(response.data).toEqual('response');
          });
          $httpBackend.flush();
        });

        it('should not refresh if data is recent', () => {
          networkService.store.activity.types = {
            '/activity/acbs': {
              data: {},
              lastUpdated: new Date(),
            },
          };
          $httpBackend.whenGET(/^\/rest\/activity\/acbs$/);
          networkService.getAcbActivity({});
          expect($httpBackend.flush).toThrow();
        });
      });
    });

    describe('for specific endpoints', () => {
      it('should authorizeUser', () => {
        $httpBackend.expectPOST(/^\/rest\/users\/userId\/authorize$/, 'payload').respond(200, { data: 'response' });
        networkService.authorizeUser('payload', 'userId').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should changePassword', () => {
        $httpBackend.expectPOST(/^\/rest\/auth\/change_password$/).respond(200, { data: 'response' });
        networkService.changePassword({ userName: '', oldPassword: 'password', newPassword: 'newPassword' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectPOST(/^\/rest\/auth\/change_expired_password$/).respond(200, { data: 'response' });
        networkService.changePassword({ userName: 'userName', oldPassword: 'password', newPassword: 'newPassword' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should confirm API Key', () => {
        $httpBackend.expectPOST(/^\/rest\/key\/confirm$/).respond(200, { data: 'response' });
        networkService.confirmApiKey('hashvalue').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should confirmPendingCp', () => {
        $httpBackend.expectPOST(/^\/rest\/certified_products\/pending\/1\/beta\/confirm$/).respond(200, { data: 'response' });
        networkService.confirmPendingCp({ pendingListing: { id: 1 }, warningAcknowledgement: false }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should confirmPendingSurveillance', () => {
        $httpBackend.expectPOST(/^\/rest\/surveillance\/pending\/confirm$/).respond(200, { data: 'response' });
        networkService.confirmPendingSurveillance('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should confirmUser', () => {
        $httpBackend.expectPOST(/^\/rest\/users\/confirm$/).respond(200, { data: 'response' });
        networkService.confirmUser('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createACB', () => {
        $httpBackend.expectPOST(/^\/rest\/acbs$/).respond(200, { data: 'response' });
        networkService.createACB('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createATL', () => {
        $httpBackend.expectPOST(/^\/rest\/atls$/).respond(200, { data: 'response' });
        networkService.createATL('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createAnnouncement', () => {
        $httpBackend.expectPOST(/^\/rest\/announcements$/).respond(200, { data: 'response' });
        networkService.createAnnouncement('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createAnnualSurveillanceReport', () => {
        $httpBackend.expectPOST(/^\/rest\/surveillance-report\/annual$/).respond(200, { data: 'response' });
        networkService.createAnnualSurveillanceReport('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createCmsId', () => {
        $httpBackend.expectPOST(/^\/rest\/certification_ids\?ids=1,2,3$/).respond(200, { data: 'response' });
        networkService.createCmsId([1, 2, 3]).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createComplaint', () => {
        $httpBackend.expectPOST(/^\/rest\/complaints/).respond(200, { data: 'response' });
        networkService.createComplaint('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createFilter', () => {
        $httpBackend.expectPOST(/^\/rest\/filters/).respond(200, { data: 'response' });
        networkService.createFilter('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createInvitedUser', () => {
        $httpBackend.expectPOST(/^\/rest\/users\/create$/).respond(200, { data: 'response' });
        networkService.createInvitedUser('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createQuarterlySurveillanceReport', () => {
        $httpBackend.expectPOST(/^\/rest\/surveillance-report\/quarterly$/).respond(200, { data: 'response' });
        networkService.createQuarterlySurveillanceReport('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createScheduleOneTimeTrigger', () => {
        $httpBackend.expectPOST(/^\/rest\/schedules\/triggers\/one_time$/).respond(200, { data: 'response' });
        networkService.createScheduleOneTimeTrigger('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createScheduleTrigger', () => {
        $httpBackend.expectPOST(/^\/rest\/schedules\/triggers$/).respond(200, { data: 'response' });
        networkService.createScheduleTrigger({ email: 'something' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should createSvap', () => {
        $httpBackend.expectPOST(/^\/rest\/svaps$/).respond(200, { data: 'response' });
        networkService.createSvap({ svapId: 1 }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should deleteAnnouncement', () => {
        $httpBackend.expectDELETE(/^\/rest\/announcements\/1$/).respond(200);
        networkService.deleteAnnouncement(1).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should deleteAnnouncement', () => {
        $httpBackend.expectDELETE(/^\/rest\/filters\/1$/).respond(200);
        networkService.deleteFilter(1).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should deleteAnnualSurveillanceReport', () => {
        $httpBackend.expectDELETE(/^\/rest\/surveillance-report\/annual\/id$/).respond(200);
        networkService.deleteAnnualSurveillanceReport('id').then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should deleteComplaint', () => {
        $httpBackend.expectDELETE(/^\/rest\/complaints\/1$/).respond(200);
        networkService.deleteComplaint(1).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should deleteQuarterlySurveillanceReport', () => {
        $httpBackend.expectDELETE(/^\/rest\/surveillance-report\/quarterly\/id$/).respond(200);
        networkService.deleteQuarterlySurveillanceReport('id').then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should deleteScheduleTrigger', () => {
        $httpBackend.expectDELETE(/^\/rest\/schedules\/triggers\/CacheStatusAgeTrigger\/something$/).respond(200);
        networkService.deleteScheduleTrigger({
          group: 'CacheStatusAgeTrigger',
          name: 'something',
        }).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should deleteSurveillance', () => {
        $httpBackend.expectDELETE(/^\/rest\/surveillance\/1$/).respond(200);
        networkService.deleteSurveillance(1, 'changeReason').then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should deleteSurveillanceDocument', () => {
        $httpBackend.expectDELETE(/^\/rest\/surveillance\/1\/document\/3$/).respond(200);
        networkService.deleteSurveillanceDocument(1, 3).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should deleteSvap', () => {
        $httpBackend.expectDELETE(/^\/rest\/svaps$/).respond(200);
        networkService.deleteSvap({ svapId: 1 }).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should deleteUser', () => {
        $httpBackend.expectDELETE(/^\/rest\/users\/1$/).respond(200);
        networkService.deleteUser(1).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should generateAnnualSurveillanceReport', () => {
        $httpBackend.expectGET(/^\/rest\/surveillance-report\/export\/annual\/id$/).respond(200, { data: 'response' });
        networkService.generateAnnualSurveillanceReport('id').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should generateQuarterlySurveillanceReport', () => {
        $httpBackend.expectGET(/^\/rest\/surveillance-report\/export\/quarterly\/id$/).respond(200, { data: 'response' });
        networkService.generateQuarterlySurveillanceReport('id').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAcbActivity', () => {
        const aDate = new Date();
        $httpBackend.expectGET(/^\/rest\/activity\/acbs$/).respond(200, { data: 'response' });
        networkService.getAcbActivity({}).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/acbs\?start=\d+$/).respond(200, { data: 'response' });
        networkService.getAcbActivity({ startDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/acbs\?end=\d+$/).respond(200, { data: 'response' });
        networkService.getAcbActivity({ endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/acbs\?start=\d+&end=\d+$/).respond(200, { data: 'response' });
        networkService.getAcbActivity({ startDate: aDate, endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAcb', () => {
        $httpBackend.expectGET(/^\/rest\/acbs\/id$/).respond(200, { data: 'response' });
        networkService.getAcb('id').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAcbs', () => {
        $httpBackend.expectGET(/^\/rest\/acbs\?editable=false$/).respond(200, { data: 'response' });
        networkService.getAcbs(false).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAccessibilityStandards', () => {
        $httpBackend.expectGET(/^\/rest\/data\/accessibility_standards$/).respond(200, { data: 'response' });
        networkService.getAccessibilityStandards().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAgeRanges', () => {
        $httpBackend.expectGET(/^\/rest\/data\/age_ranges$/).respond(200, { data: 'response' });
        networkService.getAgeRanges().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAll', () => {
        $httpBackend.expectGET(/^\/rest\/collections\/certified-products$/).respond(200, { data: 'response' });
        networkService.getAll().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAnnouncement', () => {
        $httpBackend.expectGET(/^\/rest\/announcements\/payload$/).respond(200, { data: 'response' });
        networkService.getAnnouncement('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAnnouncementActivity', () => {
        const aDate = new Date();
        $httpBackend.expectGET(/^\/rest\/activity\/announcements$/).respond(200, { data: 'response' });
        networkService.getAnnouncementActivity({}).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/announcements\?start=\d+$/).respond(200, { data: 'response' });
        networkService.getAnnouncementActivity({ startDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/announcements\?end=\d+$/).respond(200, { data: 'response' });
        networkService.getAnnouncementActivity({ endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/announcements\?start=\d+&end=\d+$/).respond(200, { data: 'response' });
        networkService.getAnnouncementActivity({ startDate: aDate, endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAnnouncements', () => {
        $httpBackend.expectGET(/^\/rest\/announcements\?future=payload$/).respond(200, { data: 'response' });
        networkService.getAnnouncements('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAnnualSurveillanceReport', () => {
        $httpBackend.expectGET(/^\/rest\/surveillance-report\/annual\/id$/).respond(200, { data: 'response' });
        networkService.getAnnualSurveillanceReport('id').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAnnualSurveillanceReports', () => {
        $httpBackend.expectGET(/^\/rest\/surveillance-report\/annual$/).respond(200, { data: 'response' });
        networkService.getAnnualSurveillanceReports().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getApiDocumentationDate', () => {
        $httpBackend.expectGET(/^\/rest\/files\/api_documentation\/details$/).respond(200, { data: 'response' });
        networkService.getApiDocumentationDate().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getActivityById', () => {
        $httpBackend.expectGET(/^\/rest\/activity\/id$/).respond(200, { data: 'response' });
        networkService.getActivityById('id').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getActivityMetadata', () => {
        const aDate = new Date();
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/api-keys$/).respond(200, { data: 'response' });
        networkService.getActivityMetadata('api-keys', {}).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/api-keys\?start=\d+$/).respond(200, { data: 'response' });
        networkService.getActivityMetadata('api-keys', { startDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/api-keys\?end=\d+$/).respond(200, { data: 'response' });
        networkService.getActivityMetadata('api-keys', { endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/api-keys\?start=\d+&end=\d+$/).respond(200, { data: 'response' });
        networkService.getActivityMetadata('api-keys', { startDate: aDate, endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/api-keys\?pageNum=12+$/).respond(200, { data: 'response' });
        networkService.getActivityMetadata('api-keys', { pageNum: 12 }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/api-keys\?pageSize=12+$/).respond(200, { data: 'response' });
        networkService.getActivityMetadata('api-keys', { pageSize: 12 }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getApiUsers including deleted', () => {
        $httpBackend.expectGET(/^\/rest\/key\?includeDeleted=true$/).respond(200, { data: 'response' });
        networkService.getApiUsers(true).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getApiUsers except deleted', () => {
        $httpBackend.expectGET(/^\/rest\/key\?includeDeleted=false$/).respond(200, { data: 'response' });
        networkService.getApiUsers().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAtl', () => {
        $httpBackend.expectGET(/^\/rest\/atls\/id$/).respond(200, { data: 'response' });
        networkService.getAtl('id').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAtlActivity', () => {
        const aDate = new Date();
        $httpBackend.expectGET(/^\/rest\/activity\/atls$/).respond(200, { data: 'response' });
        networkService.getAtlActivity({}).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/atls\?start=\d+$/).respond(200, { data: 'response' });
        networkService.getAtlActivity({ startDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/atls\?end=\d+$/).respond(200, { data: 'response' });
        networkService.getAtlActivity({ endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/atls\?start=\d+&end=\d+$/).respond(200, { data: 'response' });
        networkService.getAtlActivity({ startDate: aDate, endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getAtls', () => {
        $httpBackend.expectGET(/^\/rest\/atls\?editable=false$/).respond(200, { data: 'response' });
        networkService.getAtls(false).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getCertBodies', () => {
        $httpBackend.expectGET(/^\/rest\/data\/certification_bodies$/).respond(200, { data: 'response' });
        networkService.getCertBodies().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getCertificationCriteriaForSvap', () => {
        $httpBackend.expectGET(/^\/rest\/svaps\/criteria$/).respond(200, { data: 'response' });
        networkService.getCertificationCriteriaForSvap().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getCertificationStatuses', () => {
        $httpBackend.expectGET(/^\/rest\/data\/certification_statuses$/).respond(200, { data: 'response' });
        networkService.getCertificationStatuses().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getCertifiedProductActivity', () => {
        const aDate = new Date();
        $httpBackend.expectGET(/^\/rest\/activity\/certified_products$/).respond(200, { data: 'response' });
        networkService.getCertifiedProductActivity({}).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/certified_products\?start=\d+$/).respond(200, { data: 'response' });
        networkService.getCertifiedProductActivity({ startDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/certified_products\?end=\d+$/).respond(200, { data: 'response' });
        networkService.getCertifiedProductActivity({ endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/certified_products\?start=\d+&end=\d+$/).respond(200, { data: 'response' });
        networkService.getCertifiedProductActivity({ startDate: aDate, endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getChangeRequests', () => {
        $httpBackend.expectGET(/^\/rest\/change-requests$/).respond(200, { data: 'response' });
        networkService.getChangeRequests().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getChangeRequestStatusTypes', () => {
        $httpBackend.expectGET(/^\/rest\/data\/change-request-status-types$/).respond(200, { data: 'response' });
        networkService.getChangeRequestStatusTypes().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getChangeRequestTypes', () => {
        $httpBackend.expectGET(/^\/rest\/data\/change-request-types$/).respond(200, { data: 'response' });
        networkService.getChangeRequestTypes().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getCmsId', () => {
        $httpBackend.expectGET(/^\/rest\/certification_ids\/key\?includeCriteria=false$/).respond(200, { data: 'response' });
        networkService.getCmsId('key').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/certification_ids\/key\?includeCriteria=true$/).respond(200, { data: 'response' });
        networkService.getCmsId('key', true).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getComplaints', () => {
        $httpBackend.expectGET(/^\/rest\/complaints$/).respond(200, { data: 'response' });
        networkService.getComplaints().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getComplainantTypes', () => {
        $httpBackend.expectGET(/^\/rest\/data\/complainant-types$/).respond(200, { data: 'response' });
        networkService.getComplainantTypes().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getCmsIds', () => {
        $httpBackend.expectGET(/^\/rest\/certification_ids\/search\?ids=ids$/).respond(200, { data: 'response' });
        networkService.getCmsIds('ids').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getCriteria', () => {
        $httpBackend.expectGET(/^\/rest\/data\/certification-criteria$/).respond(200, { data: 'response' });
        networkService.getCriteria().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getCriterionProductStatistics', () => {
        $httpBackend.expectGET(/^\/rest\/statistics\/criterion_product$/).respond(200, { data: 'response' });
        networkService.getCriterionProductStatistics().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getCmsDownload', () => {
        $httpBackend.expectGET(/^\/rest\/certification_ids$/).respond(200, { data: 'response' });
        networkService.getCmsDownload().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getCollection', () => {
        $httpBackend.expectGET(/^\/rest\/collections\/certified-products\?fields=id,edition,developer,developerId,product,version,chplProductNumber,certificationStatus,criteriaMet,apiDocumentation,transparencyAttestationUrl,serviceBaseUrlList$/).respond(200, { data: 'response' });
        networkService.getCollection('apiDocumentation').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/collections\/decertified-developers$/).respond(200, { data: 'response' });
        networkService.getCollection('bannedDevelopers').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/collections\/certified-products\?fields=id,acb,chplProductNumber,developer,product$/).respond(200, { data: 'response' });
        networkService.getCollection('complaintListings').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/collections\/certified-products\?fields=id,edition,curesUpdate,developer,developerId,product,version,chplProductNumber,certificationStatus,acb,openSurveillanceNonConformityCount,closedSurveillanceNonConformityCount,openDirectReviewNonConformityCount,closedDirectReviewNonConformityCount$/).respond(200, { data: 'response' });
        networkService.getCollection('correctiveAction').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/collections\/certified-products\?fields=id,edition,curesUpdate,developer,developerId,product,version,chplProductNumber,acb,decertificationDate,certificationStatus,promotingInteroperabilityUserCount,promotingInteroperabilityUserDate$/).respond(200, { data: 'response' });
        networkService.getCollection('decertifiedProducts').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/collections\/certified-products\?fields=id,edition,curesUpdate,developer,developerId,product,version,chplProductNumber,acb,decertificationDate,certificationStatus,promotingInteroperabilityUserCount,promotingInteroperabilityUserDate$/).respond(200, { data: 'response' });
        networkService.getCollection('inactiveCertificates').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/collections\/certified-products\?fields=id,edition,developer,developerId,product,version,chplProductNumber,acb,certificationStatus,criteriaMet$/).respond(200, { data: 'response' });
        networkService.getCollection('sed').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/collections\/certified-products\?fields=id,edition,curesUpdate,developer,developerId,product,version,chplProductNumber,certificationStatus,acb,openSurveillanceCount,closedSurveillanceCount,openSurveillanceNonConformityCount,closedSurveillanceNonConformityCount,surveillanceDates$/).respond(200, { data: 'response' });
        networkService.getCollection('surveillanceManagement').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getDeveloper', () => {
        $httpBackend.expectGET(/^\/rest\/developers\/payload$/).respond(200, { data: 'response' });
        networkService.getDeveloper('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getDeveloperActivity', () => {
        const aDate = new Date();
        $httpBackend.expectGET(/^\/rest\/activity\/developers$/).respond(200, { data: 'response' });
        networkService.getDeveloperActivity({}).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/developers\?start=\d+$/).respond(200, { data: 'response' });
        networkService.getDeveloperActivity({ startDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/developers\?end=\d+$/).respond(200, { data: 'response' });
        networkService.getDeveloperActivity({ endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/developers\?start=\d+&end=\d+$/).respond(200, { data: 'response' });
        networkService.getDeveloperActivity({ startDate: aDate, endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getDeveloperHierarchy', () => {
        $httpBackend.expectGET(/^\/rest\/developers\/payload\/hierarchy$/).respond(200, { data: 'response' });
        networkService.getDeveloperHierarchy('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getDevelopers', () => {
        $httpBackend.expectGET(/^\/rest\/developers$/).respond(200, { data: 'response' });
        networkService.getDevelopers().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/developers\?showDeleted=true$/).respond(200, { data: 'response' });
        networkService.getDevelopers(true).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getDirectReviews', () => {
        $httpBackend.expectGET(/^\/rest\/developers\/id\/direct-reviews$/).respond(200, { data: 'response' });
        networkService.getDirectReviews('id').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getEditions', () => {
        $httpBackend.expectGET(/^\/rest\/data\/certification_editions$/).respond(200, { data: 'response' });
        networkService.getEditions().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getEducation', () => {
        $httpBackend.expectGET(/^\/rest\/data\/education_types$/).respond(200, { data: 'response' });
        networkService.getEducation().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getFilters', () => {
        $httpBackend.expectGET(/^\/rest\/filters\?filterTypeId=1/).respond(200, { data: 'response' });
        networkService.getFilters(1).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getFilterTypes', () => {
        $httpBackend.expectGET(/^\/rest\/data\/filter_types$/).respond(200, { data: 'response' });
        networkService.getFilterTypes().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getFuzzyTypes', () => {
        $httpBackend.expectGET(/^\/rest\/data\/fuzzy_choices$/).respond(200, { data: 'response' });
        networkService.getFuzzyTypes().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getIncumbentDeveloperStatistics', () => {
        $httpBackend.expectGET(/^\/rest\/statistics\/incumbent_developers$/).respond(200, { data: 'response' });
        networkService.getIncumbentDevelopersStatistics().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getIcsFamily', () => {
        $httpBackend.expectGET(/^\/rest\/certified_products\/id\/ics_relationships$/).respond(200, { data: 'response' });
        networkService.getIcsFamily('id').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getListing', () => {
        $httpBackend.expectGET(/^\/rest\/certified_products\/payload\/details$/).respond(200, { data: 'response' });
        networkService.getListing('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getListingBasic', () => {
        $httpBackend.expectGET(/^\/rest\/certified_products\/payload$/).respond(200, { data: 'response' });
        networkService.getListingBasic('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getListingCountStatistics', () => {
        $httpBackend.expectGET(/^\/rest\/statistics\/listing_count$/).respond(200, { data: 'response' });
        networkService.getListingCountStatistics().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getMeasures', () => {
        $httpBackend.expectGET(/^\/rest\/data\/measures$/).respond(200, { data: 'response' });
        networkService.getMeasures().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getMeasureTypes', () => {
        $httpBackend.expectGET(/^\/rest\/data\/measure-types$/).respond(200, { data: 'response' });
        networkService.getMeasureTypes().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getNonconformityStatisticsCount', () => {
        $httpBackend.expectGET(/^\/rest\/statistics\/nonconformity_criteria_count$/).respond(200, { data: 'response' });
        networkService.getNonconformityStatisticsCount().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getParticipantAgeStatistics', () => {
        $httpBackend.expectGET(/^\/rest\/statistics\/participant_age_count$/).respond(200, { data: 'response' });
        networkService.getParticipantAgeStatistics().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getParticipantComputerExperienceStatistics', () => {
        $httpBackend.expectGET(/^\/rest\/statistics\/participant_computer_experience_count$/).respond(200, { data: 'response' });
        networkService.getParticipantComputerExperienceStatistics().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getParticipantEducationStatistics', () => {
        $httpBackend.expectGET(/^\/rest\/statistics\/participant_education_count$/).respond(200, { data: 'response' });
        networkService.getParticipantEducationStatistics().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getParticipantGenderStatistics', () => {
        $httpBackend.expectGET(/^\/rest\/statistics\/participant_gender_count$/).respond(200, { data: 'response' });
        networkService.getParticipantGenderStatistics().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getParticipantProductExperienceStatistics', () => {
        $httpBackend.expectGET(/^\/rest\/statistics\/participant_product_experience_count$/).respond(200, { data: 'response' });
        networkService.getParticipantProductExperienceStatistics().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getParticipantProfessionalExperienceStatistics', () => {
        $httpBackend.expectGET(/^\/rest\/statistics\/participant_professional_experience_count$/).respond(200, { data: 'response' });
        networkService.getParticipantProfessionalExperienceStatistics().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getPendingListings', () => {
        $httpBackend.expectGET(/^\/rest\/certified_products\/pending\/metadata$/).respond(200, { data: 'response' });
        networkService.getPendingListings().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getPendingListingById', () => {
        $httpBackend.expectGET(/^\/rest\/certified_products\/pending\/id$/).respond(200, { data: 'response' });
        networkService.getPendingListingById('id').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getPractices', () => {
        $httpBackend.expectGET(/^\/rest\/data\/practice_types$/).respond(200, { data: 'response' });
        networkService.getPractices().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getProduct', () => {
        $httpBackend.expectGET(/^\/rest\/products\/productId$/).respond(200, { data: 'response' });
        networkService.getProduct('productId').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getProductActivity', () => {
        const aDate = new Date();
        $httpBackend.expectGET(/^\/rest\/activity\/products$/).respond(200, { data: 'response' });
        networkService.getProductActivity({}).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/products\?start=\d+$/).respond(200, { data: 'response' });
        networkService.getProductActivity({ startDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/products\?end=\d+$/).respond(200, { data: 'response' });
        networkService.getProductActivity({ endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/products\?start=\d+&end=\d+$/).respond(200, { data: 'response' });
        networkService.getProductActivity({ startDate: aDate, endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getProductsByDeveloper', () => {
        $httpBackend.expectGET(/^\/rest\/products\?developerId=payload$/).respond(200, { data: 'response' });
        networkService.getProductsByDeveloper('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getProductsByVersion', () => {
        $httpBackend.expectGET(/^\/rest\/certified_products\?versionId=payload&editable=p2$/).respond(200, { data: 'response' });
        networkService.getProductsByVersion('payload', 'p2').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getQmsStandards', () => {
        $httpBackend.expectGET(/^\/rest\/data\/qms_standards$/).respond(200, { data: 'response' });
        networkService.getQmsStandards().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getQuarterlySurveillanceQuarters', () => {
        $httpBackend.expectGET(/^\/rest\/data\/quarters$/).respond(200, { data: 'response' });
        networkService.getQuarterlySurveillanceQuarters().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getQuarterlySurveillanceReport', () => {
        $httpBackend.expectGET(/^\/rest\/surveillance-report\/quarterly\/id$/).respond(200, { data: 'response' });
        networkService.getQuarterlySurveillanceReport('id').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getQuarterlySurveillanceReports', () => {
        $httpBackend.expectGET(/^\/rest\/surveillance-report\/quarterly$/).respond(200, { data: 'response' });
        networkService.getQuarterlySurveillanceReports().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getRelatedListings', () => {
        $httpBackend.expectGET(/^\/rest\/products\/payload\/listings$/).respond(200, { data: 'response' });
        networkService.getRelatedListings('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getRelevantListings', () => {
        $httpBackend.expectGET(/^\/rest\/surveillance-report\/quarterly\/id\/listings$/).respond(200, { data: 'response' });
        networkService.getRelevantListings('id').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getRelevantComplaints', () => {
        $httpBackend.expectGET(/^\/rest\/surveillance-report\/quarterly\/id\/complaints$/).respond(200, { data: 'response' });
        networkService.getRelevantComplaints({ id: 'id' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getScheduledSystemJobs', () => {
        $httpBackend.expectGET(/^\/rest\/schedules\/triggers\?jobType=system$/).respond(200, { data: 'response' });
        networkService.getScheduledSystemJobs().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getScheduleJobs', () => {
        $httpBackend.expectGET(/^\/rest\/schedules\/jobs$/).respond(200, { data: 'response' });
        networkService.getScheduleJobs().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getScheduleTriggers', () => {
        $httpBackend.expectGET(/^\/rest\/schedules\/triggers$/).respond(200, { data: 'response' });
        networkService.getScheduleTriggers().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSearchOptions', () => {
        $httpBackend.expectGET(/^\/rest\/data\/search-options$/).respond(200, { data: 'response' });
        networkService.getSearchOptions().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSimpleProduct', () => {
        $httpBackend.expectGET(/^\/rest\/products\/payload$/).respond(200, { data: 'response' });
        networkService.getSimpleProduct('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSingleDeveloperActivityMetadata', () => {
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/developers\/payload$/).respond(200, { data: 'response' });
        networkService.getSingleDeveloperActivityMetadata('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSingleDeveloperActivityMetadata with end date', () => {
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/developers\/payload\?end=end$/).respond(200, { data: 'response' });
        networkService.getSingleDeveloperActivityMetadata('payload', { end: 'end' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSingleListingActivityMetadata', () => {
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/listings\/payload$/).respond(200, { data: 'response' });
        networkService.getSingleListingActivityMetadata('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSingleListingActivityMetadata with end date', () => {
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/listings\/payload\?end=end$/).respond(200, { data: 'response' });
        networkService.getSingleListingActivityMetadata('payload', { end: 'end' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSingleProductActivityMetadata', () => {
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/products\/payload$/).respond(200, { data: 'response' });
        networkService.getSingleProductActivityMetadata('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSingleProductActivityMetadata with end date', () => {
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/products\/payload\?end=end$/).respond(200, { data: 'response' });
        networkService.getSingleProductActivityMetadata('payload', { end: 'end' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSingleVersionActivityMetadata', () => {
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/versions\/payload$/).respond(200, { data: 'response' });
        networkService.getSingleVersionActivityMetadata('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSingleVersionActivityMetadata with end date', () => {
        $httpBackend.expectGET(/^\/rest\/activity\/metadata\/versions\/payload\?end=end$/).respond(200, { data: 'response' });
        networkService.getSingleVersionActivityMetadata('payload', { end: 'end' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSedParticipantStatisticsCount', () => {
        $httpBackend.expectGET(/^\/rest\/statistics\/sed_participant_count$/).respond(200, { data: 'response' });
        networkService.getSedParticipantStatisticsCount().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSurveillanceActivityReport', () => {
        $httpBackend.expectGET(/^\/rest\/surveillance\/reports\/activity\?start=start&end=end$/).respond(200, { data: 'response' });
        networkService.getSurveillanceActivityReport({ startDate: 'start', endDate: 'end' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSurveillanceLookups', () => {
        $httpBackend.expectGET(/^\/rest\/data\/surveillance_types$/).respond(200, { data: 'surveillance_types' });
        $httpBackend.expectGET(/^\/rest\/data\/surveillance_requirement_types$/).respond(200, { data: 'surveillance_requirement_types' });
        $httpBackend.expectGET(/^\/rest\/data\/surveillance_result_types$/).respond(200, { data: 'surveillance_result_types' });
        $httpBackend.expectGET(/^\/rest\/data\/surveillance-requirements$/).respond(200, { data: 'surveillance_requirements' });
        $httpBackend.expectGET(/^\/rest\/data\/nonconformity-types$/).respond(200, { data: 'nonconformity_types' });
        const response = networkService.getSurveillanceLookups();
        $httpBackend.flush();
        expect(response).toEqual({
          surveillanceTypes: { data: 'surveillance_types' },
          surveillanceRequirementTypes: { data: 'surveillance_requirement_types' },
          surveillanceResultTypes: { data: 'surveillance_result_types' },
          surveillanceRequirements: { data: 'surveillance_requirements' },
          nonconformityTypes: { data: 'nonconformity_types' },
        });
      });

      it('should getSurveillanceOutcomes', () => {
        $httpBackend.expectGET(/^\/rest\/data\/surveillance-outcomes$/).respond(200, { data: 'response' });
        networkService.getSurveillanceOutcomes().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSurveillanceProcessTypes', () => {
        $httpBackend.expectGET(/^\/rest\/data\/surveillance-process-types$/).respond(200, { data: 'response' });
        networkService.getSurveillanceProcessTypes().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getSvaps', () => {
        $httpBackend.expectGET(/^\/rest\/svaps$/).respond(200, { data: 'response' });
        networkService.getSvaps().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getTargetedUsers', () => {
        $httpBackend.expectGET(/^\/rest\/data\/targeted_users$/).respond(200, { data: 'response' });
        networkService.getTargetedUsers().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getTestData', () => {
        $httpBackend.expectGET(/^\/rest\/data\/test_data$/).respond(200, { data: 'response' });
        networkService.getTestData().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getTestFunctionality', () => {
        $httpBackend.expectGET(/^\/rest\/data\/test_functionality$/).respond(200, { data: 'response' });
        networkService.getTestFunctionality().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getTestProcedures', () => {
        $httpBackend.expectGET(/^\/rest\/data\/test_procedures$/).respond(200, { data: 'response' });
        networkService.getTestProcedures().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getTestStandards', () => {
        $httpBackend.expectGET(/^\/rest\/data\/test_standards$/).respond(200, { data: 'response' });
        networkService.getTestStandards().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getTestTools', () => {
        $httpBackend.expectGET(/^\/rest\/data\/test_tools$/).respond(200, { data: 'response' });
        networkService.getTestTools().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getUcdProcesses', () => {
        $httpBackend.expectGET(/^\/rest\/data\/ucd_processes$/).respond(200, { data: 'response' });
        networkService.getUcdProcesses().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getUploadingSurveillances', () => {
        $httpBackend.expectGET(/^\/rest\/surveillance\/pending$/).respond(200, { data: 'response' });
        networkService.getUploadingSurveillances().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getUploadTemplateVersions', () => {
        $httpBackend.expectGET(/^\/rest\/data\/upload_template_versions$/).respond(200, { data: 'response' });
        networkService.getUploadTemplateVersions().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getUserActivitiesActivity', () => {
        const aDate = new Date();
        $httpBackend.expectGET(/^\/rest\/activity\/user_activities$/).respond(200, { data: 'response' });
        networkService.getUserActivities({}).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/user_activities\?start=\d+$/).respond(200, { data: 'response' });
        networkService.getUserActivities({ startDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/user_activities\?end=\d+$/).respond(200, { data: 'response' });
        networkService.getUserActivities({ endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/user_activities\?start=\d+&end=\d+$/).respond(200, { data: 'response' });
        networkService.getUserActivities({ startDate: aDate, endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getUserActivity', () => {
        const aDate = new Date();
        $httpBackend.expectGET(/^\/rest\/activity\/users$/).respond(200, { data: 'response' });
        networkService.getUserActivity({}).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/users\?start=\d+$/).respond(200, { data: 'response' });
        networkService.getUserActivity({ startDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/users\?end=\d+$/).respond(200, { data: 'response' });
        networkService.getUserActivity({ endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/users\?start=\d+&end=\d+$/).respond(200, { data: 'response' });
        networkService.getUserActivity({ startDate: aDate, endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getUsers', () => {
        $httpBackend.expectGET(/^\/rest\/users$/).respond(200, { data: 'response' });
        networkService.getUsers().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getUsersAtAcb', () => {
        $httpBackend.expectGET(/^\/rest\/acbs\/payload\/users$/).respond(200, { data: 'response' });
        networkService.getUsersAtAcb('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getUsersAtAtl', () => {
        $httpBackend.expectGET(/^\/rest\/atls\/payload\/users$/).respond(200, { data: 'response' });
        networkService.getUsersAtAtl('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getUsersAtDeveloper', () => {
        $httpBackend.expectGET(/^\/rest\/developers\/payload\/users$/).respond(200, { data: 'response' });
        networkService.getUsersAtDeveloper('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getVersion', () => {
        $httpBackend.expectGET(/^\/rest\/versions\/payload$/).respond(200, { data: 'response' });
        networkService.getVersion('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getVersionActivity', () => {
        const aDate = new Date();
        $httpBackend.expectGET(/^\/rest\/activity\/versions$/).respond(200, { data: 'response' });
        networkService.getVersionActivity({}).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/versions\?start=\d+$/).respond(200, { data: 'response' });
        networkService.getVersionActivity({ startDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/versions\?end=\d+$/).respond(200, { data: 'response' });
        networkService.getVersionActivity({ endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
        $httpBackend.expectGET(/^\/rest\/activity\/versions\?start=\d+&end=\d+$/).respond(200, { data: 'response' });
        networkService.getVersionActivity({ startDate: aDate, endDate: aDate }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should getVersionsByProduct', () => {
        $httpBackend.expectGET(/^\/rest\/versions\?productId=payload$/).respond(200, { data: 'response' });
        networkService.getVersionsByProduct('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should impersonateUser', () => {
        $httpBackend.expectGET(/^\/rest\/auth\/beta\/impersonate\?id=id$/).respond(200, { data: 'response' });
        networkService.impersonateUser({ userId: 'id' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should initiateSurveillance', () => {
        $httpBackend.expectPOST(/^\/rest\/surveillance$/).respond(200, { data: 'response' });
        networkService.initiateSurveillance('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should inviteUser', () => {
        $httpBackend.expectPOST(/^\/rest\/users\/invite$/).respond(200, { data: 'response' });
        networkService.inviteUser('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should keepalive', () => {
        $httpBackend.expectGET(/^\/rest\/auth\/keep_alive$/).respond(200, { data: 'response' });
        networkService.keepalive('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should login', () => {
        $httpBackend.expectPOST(/^\/rest\/auth\/authenticate$/).respond(200, { data: 'response' });
        networkService.login('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should lookupCertificationId', () => {
        $httpBackend.expectGET(/^\/rest\/certification_ids\/payload$/).respond(200, { data: 'response' });
        networkService.lookupCertificationId('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should massRejectPendingListings', () => {
        $httpBackend.expectDELETE(/^\/rest\/certified_products\/pending$/).respond(200);
        networkService.massRejectPendingListings('payload').then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should massRejectPendingSurveillance', () => {
        $httpBackend.expectDELETE(/^\/rest\/surveillance\/pending$/).respond(200);
        networkService.massRejectPendingSurveillance('payload').then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should mergeDevelopers', () => {
        $httpBackend.expectPOST(/^\/rest\/developers\/merge$/).respond(200, { data: 'response' });
        networkService.mergeDevelopers('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should modifyACB', () => {
        $httpBackend.expectPUT(/^\/rest\/acbs\/id$/).respond(200, { data: 'response' });
        networkService.modifyACB({ id: 'id' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should modifyATL', () => {
        $httpBackend.expectPUT(/^\/rest\/atls\/id$/).respond(200, { data: 'response' });
        networkService.modifyATL({ id: 'id' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should modifyAnnouncement', () => {
        $httpBackend.expectPUT(/^\/rest\/announcements\/id$/).respond(200, { data: 'response' });
        networkService.modifyAnnouncement({ id: 'id' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should registerApi', () => {
        $httpBackend.expectPOST(/^\/rest\/key$/).respond(200, { data: 'response' });
        networkService.registerApi('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should rejectPendingCp', () => {
        $httpBackend.expectDELETE(/^\/rest\/certified_products\/pending\/1$/).respond(200);
        networkService.rejectPendingCp(1).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should rejectPendingSurveillance', () => {
        $httpBackend.expectDELETE(/^\/rest\/surveillance\/pending\/1$/).respond(200);
        networkService.rejectPendingSurveillance(1).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should removeUserFromAcb', () => {
        $httpBackend.expectDELETE(/^\/rest\/acbs\/2\/users\/1$/).respond(200);
        networkService.removeUserFromAcb(1, 2).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should removeUserFromAtl', () => {
        $httpBackend.expectDELETE(/^\/rest\/atls\/2\/users\/1$/).respond(200);
        networkService.removeUserFromAtl(1, 2).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should removeUserFromDeveloper', () => {
        $httpBackend.expectDELETE(/^\/rest\/developers\/2\/users\/1$/).respond(200);
        networkService.removeUserFromDeveloper(1, 2).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should requestApiKey', () => {
        $httpBackend.expectPOST(/^\/rest\/key\/request$/).respond(200, { data: 'response' });
        networkService.requestApiKey('Org', 'abc@company.com').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should resetPassword', () => {
        $httpBackend.expectPOST(/^\/rest\/auth\/reset_password_request$/).respond(200, { data: 'response' });
        networkService.resetPassword('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should emailResetPassword', () => {
        $httpBackend.expectPOST(/^\/rest\/auth\/email_reset_password$/).respond(200, { data: 'response' });
        networkService.emailResetPassword('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should revokeApi', () => {
        $httpBackend.expectDELETE(/^\/rest\/key\/userKey$/).respond(200);
        networkService.revokeApi({ key: 'userKey' }).then((response) => {
          expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
      });

      it('should search', () => {
        $httpBackend.expectPOST(/^\/rest\/search$/).respond(200, { data: 'response' });
        networkService.search('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should splitDeveloper', () => {
        $httpBackend.expectPOST(/^\/rest\/developers\/1\/split$/).respond(200, { data: 'response' });
        networkService.splitDeveloper({ oldDeveloper: { developerId: 1 } }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should splitProduct', () => {
        $httpBackend.expectPOST(/^\/rest\/products\/1\/split$/).respond(200, { data: 'response' });
        networkService.splitProduct({ oldProduct: { productId: 1 } }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should splitVersion', () => {
        $httpBackend.expectPOST(/^\/rest\/versions\/1\/split$/).respond(200, { data: 'response' });
        networkService.splitVersion({ oldVersion: { versionId: 1 } }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should submitChangeRequest', () => {
        $httpBackend.expectPOST(/^\/rest\/change-requests$/).respond(200, { data: 'response' });
        networkService.submitChangeRequest({ details: { data: 1 } }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should unimpersonateUser', () => {
        $httpBackend.expectGET(/^\/rest\/auth\/unimpersonate$/).respond(200, { data: 'response' });
        networkService.unimpersonateUser().then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateAnnualSurveillanceReport', () => {
        $httpBackend.expectPUT(/^\/rest\/surveillance-report\/annual$/).respond(200, { data: 'response' });
        networkService.updateAnnualSurveillanceReport('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateChangeRequest', () => {
        $httpBackend.expectPUT(/^\/rest\/change-requests$/).respond(200, { data: 'response' });
        networkService.updateChangeRequest({ id: 1 }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateComplaint', () => {
        $httpBackend.expectPUT(/^\/rest\/complaints\/1$/).respond(200, { data: 'response' });
        networkService.updateComplaint({ id: 1 }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateCP', () => {
        $httpBackend.expectPUT(/^\/rest\/certified_products\/id$/).respond(200, { data: 'response' });
        networkService.updateCP({ listing: { id: 'id' }, reason: 'none' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateDeveloper', () => {
        $httpBackend.expectPUT(/^\/rest\/developers\/id$/).respond(200, { data: 'response' });
        networkService.updateDeveloper({ developerId: 'id' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateFuzzyType', () => {
        $httpBackend.expectPUT(/^\/rest\/data\/fuzzy_choices\/3$/).respond(200, { data: 'response' });
        networkService.updateFuzzyType({ id: 3 }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateJob', () => {
        $httpBackend.expectPUT(/^\/rest\/schedules\/jobs$/).respond(200, { data: 'response' });
        networkService.updateJob('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateQuarterlySurveillanceReport', () => {
        $httpBackend.expectPUT(/^\/rest\/surveillance-report\/quarterly$/).respond(200, { data: 'response' });
        networkService.updateQuarterlySurveillanceReport('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateProduct', () => {
        $httpBackend.expectPUT(/^\/rest\/products$/).respond(200, { data: 'response' });
        networkService.updateProduct('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateRelevantListing', () => {
        $httpBackend.expectPUT(/^\/rest\/surveillance-report\/quarterly\/qid\/listings\/lid$/).respond(200, { data: 'response' });
        networkService.updateRelevantListing('qid', { id: 'lid' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateRelevantSurveillance', () => {
        $httpBackend.expectPUT(/^\/rest\/surveillance-report\/quarterly\/qid\/surveillance\/sid$/).respond(200, { data: 'response' });
        networkService.updateRelevantSurveillance('qid', { id: 'sid' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateScheduleTrigger', () => {
        $httpBackend.expectPUT(/^\/rest\/schedules\/triggers$/).respond(200, { data: 'response' });
        networkService.updateScheduleTrigger({ name: 'something' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateSurveillance', () => {
        $httpBackend.expectPUT(/^\/rest\/surveillance\/id$/).respond(200, { data: 'response' });
        networkService.updateSurveillance({ id: 'id' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateSvap', () => {
        $httpBackend.expectPUT(/^\/rest\/svaps$/).respond(200, { data: 'response' });
        networkService.updateSvap({ svapId: 'id' }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateUser', () => {
        $httpBackend.expectPUT(/^\/rest\/users\/2$/).respond(200, { data: 'response' });
        networkService.updateUser({ userId: 2 }).then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should updateVersion', () => {
        $httpBackend.expectPUT(/^\/rest\/versions$/).respond(200, { data: 'response' });
        networkService.updateVersion('payload').then((response) => {
          expect(response.data).toEqual('response');
        });
        $httpBackend.flush();
      });

      it('should get the current system status', () => {
        $httpBackend.expectGET(/^\/rest\/system-status$/).respond(200, { data: 'response' });
        networkService.getSystemStatus().then((response) => {
          expect(response.data).toEqual({ data: 'response' });
        });
        $httpBackend.flush();
      });
    });
  });
})();
