(() => {
  'use strict';

  describe('the Confirm Listing component', () => {
    var $compile, $log, $q, Mock, ctrl, el, mock, networkService, scope;

    mock = {};
    mock.listing = {
      developer: { developerId: 1 },
      certificationEdition: { name: 2015 },
    };

    beforeEach(() => {
      angular.mock.module('chpl.administration', 'chpl.mock', $provide => {
        $provide.decorator('networkService', $delegate => {
          $delegate.confirmPendingCp = jasmine.createSpy('confirmPendingCp');
          $delegate.getAccessibilityStandards = jasmine.createSpy('getAccessibilityStandards');
          $delegate.getAtls = jasmine.createSpy('getAtls');
          $delegate.getDeveloper = jasmine.createSpy('getDeveloper');
          $delegate.getMeasureTypes = jasmine.createSpy('getMeasureTypes');
          $delegate.getMeasures = jasmine.createSpy('getMeasures');
          $delegate.getQmsStandards = jasmine.createSpy('getQmsStandards');
          $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
          $delegate.getTargetedUsers = jasmine.createSpy('getTargetedUsers');
          $delegate.getTestData = jasmine.createSpy('getTestData');
          $delegate.getTestFunctionality = jasmine.createSpy('getTestFunctionality');
          $delegate.getTestProcedures = jasmine.createSpy('getTestProcedures');
          $delegate.getTestStandards = jasmine.createSpy('getTestStandards');
          $delegate.getUcdProcesses = jasmine.createSpy('getUcdProcesses');
          $delegate.rejectPendingCp = jasmine.createSpy('rejectPendingCp');

          return $delegate;
        });
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _Mock_, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        Mock = _Mock_;
        networkService = _networkService_;
        networkService.confirmPendingCp.and.returnValue($q.when({}));
        networkService.getAccessibilityStandards.and.returnValue($q.when({}));
        networkService.getAtls.and.returnValue($q.when({}));
        networkService.getDeveloper.and.returnValue($q.when(Mock.developers[0]));
        networkService.getMeasureTypes.and.returnValue($q.when({}));
        networkService.getMeasures.and.returnValue($q.when({}));
        networkService.getQmsStandards.and.returnValue($q.when({}));
        networkService.getSearchOptions.and.returnValue($q.when({}));
        networkService.getTargetedUsers.and.returnValue($q.when({}));
        networkService.getTestData.and.returnValue($q.when({}));
        networkService.getTestFunctionality.and.returnValue($q.when({}));
        networkService.getTestProcedures.and.returnValue($q.when({}));
        networkService.getTestStandards.and.returnValue($q.when({}));
        networkService.getUcdProcesses.and.returnValue($q.when({}));
        networkService.rejectPendingCp.and.returnValue($q.when({}));

        scope = $rootScope.$new();
        scope.listing = mock.listing;
        el = angular.element('<chpl-confirm-listing listing="listing"></chpl-confirm-listing>');

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

      xdescribe('when confirming or rejecting', () => {
        it('should close the modal if confirmation is successful', () => {
          ctrl.confirm();
          scope.$digest();
          expect(Mock.modalInstance.close).toHaveBeenCalledWith({
            status: 'confirmed',
            developerCreated: false,
            developer: undefined,
          });
        });

        it('should close the modal if rejection is successful', () => {
          ctrl.reject();
          scope.$digest();
          expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 'rejected'});
        });

        it('should not dismiss the modal if confirmation fails', () => {
          networkService.confirmPendingCp.and.returnValue($q.reject({data: {errorMessages: []}}));
          ctrl.confirm();
          scope.$digest();
          expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
        });

        it('should not dismiss the modal if rejection fails', () => {
          networkService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: []}}));
          ctrl.reject();
          scope.$digest();
          expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
        });

        it('should have error messages if confirmation fails', () => {
          networkService.confirmPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
          ctrl.confirm();
          scope.$digest();
          expect(ctrl.errorMessages).toEqual([1,2]);
        });

        it('should have error messages if rejection fails', () => {
          networkService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
          ctrl.reject();
          scope.$digest();
          expect(ctrl.errorMessages).toEqual([1,2]);
        });

        it('should dismiss the modal with the contact if the pending listing was already resolved on confirmation', () => {
          var contact = {name: 'person'};
          networkService.confirmPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2], contact: contact, objectId: 1}}));
          ctrl.confirm();
          scope.$digest();
          expect(Mock.modalInstance.close).toHaveBeenCalledWith({
            contact: contact,
            objectId: 1,
            status: 'resolved',
          });
        });

        it('should dismiss the modal with the contact if the pending listing was already resolved on rejection', () => {
          var contact = {name: 'person'};
          networkService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2], contact: contact, objectId: 1}}));
          ctrl.reject();
          scope.$digest();
          expect(Mock.modalInstance.close).toHaveBeenCalledWith({
            contact: contact,
            objectId: 1,
            status: 'resolved',
          });
        });
      });

      xdescribe('when analyzing the developer', () => {
        beforeEach(() => {
          ctrl.developer = {
            developerId: 999,
            name: 'Dude',
            website: 'http://www.abcdefgxyz123.com',
            address: {
              line1: '999 Bowling Way',
              city: 'LA',
              state: 'CA',
              zipcode: '55555',
            },
            contact: {
              fullName: 'The Dude',
              email: 'abc@abcdefg.com',
              phoneNumber: '999-999-9999',
            },
            transparencyAttestations: [{
              acbId: 3,
              acbName: 'Drummond Group',
              attestation: {transparencyAttestation: 'Affirmative', removed: true},
            }],
          };
          ctrl.cp.developer.developerId = ctrl.developer.developerId;
          ctrl.cp.certifyingBody = {
            code: '04',
            name: 'Drummond Group',
            id: 3,
          };
        });

        describe('with respect to system developer info', () => {
          describe('that is missing', () => {
            function testMissingData (developerObj, propToRemove) {
              expect(developerObj[propToRemove]).toBeTruthy();
              expect(ctrl.isDisabled()).toBe(false);

              developerObj[propToRemove] = '';
              expect(developerObj[propToRemove]).toBeFalsy();
              expect(ctrl.isDisabled()).toBe(true);
              developerObj[propToRemove] = ' ';
              expect(ctrl.isDisabled()).toBe(true);
            }

            const shouldDisableNextButton = 'then it should disable the next button';

            it('developer name ' + shouldDisableNextButton, () => {
              testMissingData(ctrl.developer, 'name');
            });

            it('developer website ' + shouldDisableNextButton, () => {
              testMissingData(ctrl.developer, 'website');
            });

            it('contact full name ' + shouldDisableNextButton, () => {
              testMissingData(ctrl.developer.contact, 'fullName');
            });

            it('contact email ' + shouldDisableNextButton, () => {
              testMissingData(ctrl.developer.contact, 'email');
            });

            it('contact phone number ' + shouldDisableNextButton, () => {
              testMissingData(ctrl.developer.contact, 'phoneNumber');
            });

            it('address line1 ' + shouldDisableNextButton, () => {
              testMissingData(ctrl.developer.address, 'line1');
            });

            it('address city ' + shouldDisableNextButton, () => {
              testMissingData(ctrl.developer.address, 'city');
            });

            it('address state ' + shouldDisableNextButton, () => {
              testMissingData(ctrl.developer.address, 'state');
            });

            it('address zipcode ' + shouldDisableNextButton, () => {
              testMissingData(ctrl.developer.address, 'zipcode');
            });
          });

          const shouldEnableNextButton = 'should enable the next button';

          it('has all contact info then it ' + shouldEnableNextButton, () => {
            expect(ctrl.developer.name).toBeTruthy();
            expect(ctrl.developer.website).toBeTruthy();
            expect(ctrl.developer.contact.fullName).toBeTruthy();
            expect(ctrl.developer.contact.email).toBeTruthy();
            expect(ctrl.developer.contact.phoneNumber).toBeTruthy();
            expect(ctrl.developer.address.line1).toBeTruthy();
            expect(ctrl.developer.address.city).toBeTruthy();
            expect(ctrl.developer.address.state).toBeTruthy();
            expect(ctrl.developer.address.zipcode).toBeTruthy();
            expect(ctrl.isDisabled()).toBe(false);
          });
        });
      });
    });
  });
})();
