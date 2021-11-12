(() => {
  describe('the surveillance edit component', () => {
    let $compile;
    let $log;
    let $q;
    let $uibModal;
    let Mock;
    let actualOptions;
    let authService;
    let ctrl;
    let el;
    let networkService;
    let scope;
    let utilService;

    beforeEach(() => {
      angular.mock.module('chpl.mock', 'chpl.components', ($provide) => {
        $provide.decorator('authService', ($delegate) => ({
          ...$delegate,
          hasAnyRole: jasmine.createSpy('hasAnyRole'),
        }));
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          deleteSurveillance: jasmine.createSpy('deleteSurveillance'),
          getComplaints: jasmine.createSpy('getComplaints'),
          initiateSurveillance: jasmine.createSpy('initiateSurveillance'),
          updateSurveillance: jasmine.createSpy('updateSurveillance'),
        }));
        $provide.decorator('utilService', ($delegate) => ({
          ...$delegate,
          findModel: jasmine.createSpy('findModel'),
          sortRequirements: jasmine.createSpy('sortRequirements'),
        }));
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _authService_, _networkService_, _utilService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        authService = _authService_;
        authService.hasAnyRole.and.returnValue(false);
        networkService = _networkService_;
        networkService.deleteSurveillance.and.returnValue($q.when({}));
        networkService.getComplaints.and.returnValue($q.when([]));
        networkService.initiateSurveillance.and.returnValue($q.when({}));
        networkService.updateSurveillance.and.returnValue($q.when({}));
        utilService = _utilService_;
        utilService.findModel.and.returnValue({});
        utilService.sortRequirements.and.returnValue(1);
        Mock = _Mock_;
        $uibModal = _$uibModal_;
        spyOn($uibModal, 'open').and.callFake((options) => {
          actualOptions = options;
          return Mock.fakeModal;
        });

        el = angular.element('<ai-surveillance-edit close="close($value)" dismiss="dismiss()" resolve="resolve"></ai-surveillance-edit>');

        scope = $rootScope.$new();
        scope.close = jasmine.createSpy('close');
        scope.dismiss = jasmine.createSpy('dismiss');
        scope.resolve = {
          surveillance: Mock.surveillances[0],
          surveillanceTypes: Mock.surveillanceData,
          workType: 'edit',
        };
        $compile(el)(scope);
        scope.$digest();
        ctrl = el.isolateScope().$ctrl;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('template', () => {
      it('should be compiled', () => {
        expect(el.html()).not.toEqual(null);
      });
    });

    describe('controller', () => {
      it('should exist', () => {
        expect(ctrl).toBeDefined();
      });

      it('should have a way to close it\'s own modal', () => {
        expect(ctrl.cancel).toBeDefined();
        ctrl.cancel();
        expect(scope.dismiss).toHaveBeenCalled();
      });

      it('should be able to determine if Requirement is removed', () => {
        let removed = ctrl.isRequirementRemoved('170.523 (k)(1)');
        expect(removed).toBeFalse();
        removed = ctrl.isRequirementRemoved('170.523 (k)(2)');
        expect(removed).toBeTrue();
      });

      describe('during activation', () => {
        it('should provide authorities', () => {
          authService.hasAnyRole.and.callFake((params) => params.reduce((acc, param) => acc || param === 'ROLE_ONC', false)); // user is ONC
          // base line
          expect(ctrl.authority).toBeUndefined();
          expect(ctrl.surveillance.type).toBeDefined();

          const newSurv = angular.copy(Mock.surveillances[0]);
          newSurv.endDay = angular.copy(newSurv.startDay);
          newSurv.startDay = undefined;
          newSurv.type = undefined;
          authService.hasAnyRole.and.returnValue(true);
          scope.resolve = {
            surveillance: newSurv,
            surveillanceTypes: Mock.surveillanceData,
            workType: 'edit',
          };
          el = angular.element('<ai-surveillance-edit close="close($value)" dismiss="dismiss()" resolve="resolve"></ai-surveillance-edit>');
          $compile(el)(scope);
          scope.$digest();
          ctrl = el.isolateScope().$ctrl;
          expect(ctrl.authority).toEqual('ROLE_ONC');
          expect(ctrl.surveillance.type).toBeUndefined();
        });

        describe('on initiation', () => {
          it('should set authority', () => {
            authService.hasAnyRole.and.callFake((params) => params.reduce((acc, param) => acc || param === 'ROLE_ACB', false)); // user is ACB
            scope.resolve = {
              surveillance: {},
              surveillanceTypes: Mock.surveillanceData,
              workType: 'initiate',
            };
            el = angular.element('<ai-surveillance-edit close="close($value)" dismiss="dismiss()" resolve="resolve"></ai-surveillance-edit>');
            $compile(el)(scope);
            scope.$digest();
            ctrl = el.isolateScope().$ctrl;
            expect(ctrl.authority).toBe('ROLE_ACB');
            expect(ctrl.surveillance.authority).toBe('ROLE_ACB');
          });
        });
      });

      describe('when adding a new requirement', () => {
        let modalOptions;
        beforeEach(() => {
          modalOptions = {
            component: 'aiSurveillanceRequirementEdit',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
              disableValidation: jasmine.any(Function),
              randomized: jasmine.any(Function),
              randomizedSitesUsed: jasmine.any(Function),
              requirement: jasmine.any(Function),
              surveillanceId: jasmine.any(Function),
              surveillanceTypes: jasmine.any(Function),
              workType: jasmine.any(Function),
            },
          };
        });

        it('should create a modal instance', () => {
          expect(ctrl.modalInstance).toBeUndefined();
          ctrl.addRequirement();
          expect(ctrl.modalInstance).toBeDefined();
        });

        it('should resolve elements on that modal', () => {
          ctrl.addRequirement();
          expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
          expect(actualOptions.resolve.disableValidation()).toBe(false);
          expect(actualOptions.resolve.randomized()).toBe(false);
          expect(actualOptions.resolve.randomizedSitesUsed()).toBeNull();
          expect(actualOptions.resolve.requirement()).toEqual({ nonconformities: [] });
          expect(actualOptions.resolve.surveillanceId()).toEqual(Mock.surveillances[0].id);
          expect(angular.toJson(actualOptions.resolve.surveillanceTypes())).toEqual(angular.toJson(Mock.surveillanceData));
          expect(actualOptions.resolve.workType()).toEqual('add');
        });

        it('should create an array of requirements if one doesn\'t exist', () => {
          ctrl.surveillance.requirements = undefined;
          ctrl.addRequirement();
          ctrl.modalInstance.close({});
          expect(ctrl.surveillance.requirements.length).toBe(1);
        });

        it('should append the response to the array of requirements', () => {
          const reqCount = ctrl.surveillance.requirements.length;
          ctrl.addRequirement();
          ctrl.modalInstance.close({});
          expect(ctrl.surveillance.requirements.length).toBe(reqCount + 1);
        });

        it('should log a non-closed modal', () => {
          const logCount = $log.info.logs.length;
          ctrl.addRequirement();
          ctrl.modalInstance.dismiss('string');
          expect($log.info.logs.length).toBe(logCount + 1);
        });

        it('should filter out removed criteria when user is ROLE_ACB', () => {
          authService.hasAnyRole.and.callFake((params) => params.reduce((acc, param) => acc || param === 'ROLE_ACB', false)); // user is ACB
          ctrl.data = {
            surveillanceRequirements: {
              criteriaOptions: [{ removed: false }, { removed: false }, { removed: true }],
              criteriaOptions2015: [{ removed: false }, { removed: false }, { removed: true }],
            },
          };
          ctrl.addRequirement();
          expect(actualOptions.resolve.surveillanceTypes().surveillanceRequirements.criteriaOptions.length).toBe(2);
        });

        it('should not change base data', () => {
          authService.hasAnyRole.and.callFake((params) => params.reduce((acc, param) => acc || param === 'ROLE_ACB', false)); // user is ACB
          ctrl.data = {
            surveillanceRequirements: {
              criteriaOptions: [{ removed: false }, { removed: false }, { removed: true }],
            },
          };
          ctrl.addRequirement();
          expect(ctrl.data.surveillanceRequirements.criteriaOptions.length).toBe(3);
        });

        it('should not filter out removed criteria when user is ROLE_ONC', () => {
          authService.hasAnyRole.and.callFake((params) => params.reduce((acc, param) => acc || param === 'ROLE_ONC', false)); // user is ONC
          ctrl.data = {
            surveillanceRequirements: {
              criteriaOptions: [{ removed: false }, { removed: false }, { removed: true }],
            },
          };
          ctrl.addRequirement();
          expect(actualOptions.resolve.surveillanceTypes().surveillanceRequirements.criteriaOptions.length).toBe(3);
        });
      });

      describe('when deleting requirements', () => {
        it('should be able to remove requirements', () => {
          ctrl.surveillance.requirements = [
            { id: 1, type: 'fake' },
            { id: 2, type: 'fake2' },
          ];
          ctrl.deleteRequirement({ id: 2, type: 'fake2' });
          expect(ctrl.surveillance.requirements).toEqual([{ id: 1, type: 'fake' }]);
        });
      });

      xdescribe('when deleting the surveillance', () => {
        beforeEach(() => {
          ctrl.reason = 'a reason';
        });

        it('should close it\'s own modal on a status:200 response', () => {
          networkService.deleteSurveillance.and.returnValue($q.when({ status: 200 }));
          ctrl.deleteSurveillance();
          scope.$digest();
          expect(scope.close).toHaveBeenCalledWith({ status: 200 });
        });

        it('should close it\'s own modal if no status in the response', () => {
          networkService.deleteSurveillance.and.returnValue($q.when({}));
          ctrl.deleteSurveillance();
          scope.$digest();
          expect(scope.close).toHaveBeenCalledWith({});
        });

        it('should close it\'s own modal if status is an object in the response', () => {
          networkService.deleteSurveillance.and.returnValue($q.when({ status: { status: 'OK' } }));
          ctrl.deleteSurveillance();
          scope.$digest();
          expect(scope.close).toHaveBeenCalledWith({ status: { status: 'OK' } });
        });

        it('should report errors if status has errors', () => {
          networkService.deleteSurveillance.and.returnValue($q.when({ status: 'bad' }));
          ctrl.deleteSurveillance();
          scope.$digest();
          expect(ctrl.errorMessages[0].status).toBe('bad');
        });

        it('should report errors if request fails', () => {
          networkService.deleteSurveillance.and.returnValue($q.reject({ statusText: 'errors' }));
          ctrl.deleteSurveillance();
          scope.$digest();
          expect(ctrl.errorMessages).toEqual(['errors']);
        });

        it('should not allow deleting a surveillance without a Reason for Change', () => {
          const callCount = networkService.deleteSurveillance.calls.count();
          ctrl.reason = undefined;
          ctrl.deleteSurveillance();
          scope.$digest();
          expect(networkService.deleteSurveillance.calls.count()).toBe(callCount);
        });

        it('should pass the Reason for Change to the network service', () => {
          ctrl.deleteSurveillance();
          expect(networkService.deleteSurveillance).toHaveBeenCalledWith(ctrl.surveillance.id, 'a reason');
        });
      });

      describe('when editing a requirement', () => {
        let modalOptions;
        beforeEach(() => {
          modalOptions = {
            component: 'aiSurveillanceRequirementEdit',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
              disableValidation: jasmine.any(Function),
              randomized: jasmine.any(Function),
              randomizedSitesUsed: jasmine.any(Function),
              requirement: jasmine.any(Function),
              surveillanceId: jasmine.any(Function),
              surveillanceTypes: jasmine.any(Function),
              workType: jasmine.any(Function),
            },
          };
          ctrl.surveillance.requirements = [
            { id: 1, type: 'fake' },
            { id: 2, type: 'fake2' },
          ];
        });

        it('should create a modal instance', () => {
          expect(ctrl.modalInstance).toBeUndefined();
          ctrl.editRequirement(ctrl.surveillance.requirements[1]);
          expect(ctrl.modalInstance).toBeDefined();
        });

        it('should resolve elements on that modal', () => {
          ctrl.editRequirement(ctrl.surveillance.requirements[1]);
          expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
          expect(actualOptions.resolve.disableValidation()).toBe(false);
          expect(actualOptions.resolve.randomized()).toBe(false);
          expect(actualOptions.resolve.randomizedSitesUsed()).toBeNull();
          expect(actualOptions.resolve.requirement()).toEqual(ctrl.surveillance.requirements[1]);
          expect(actualOptions.resolve.surveillanceId()).toEqual(Mock.surveillances[0].id);
          expect(angular.toJson(actualOptions.resolve.surveillanceTypes())).toEqual(angular.toJson(Mock.surveillanceData));
          expect(actualOptions.resolve.workType()).toEqual('edit');
        });

        it('should create a temporary guid if one doesn\'t exist', () => {
          const req = { name: 'fake' };
          ctrl.editRequirement(req);
          expect(req.guiId).toEqual(jasmine.any(Number));
        });

        it('should replace the array object with the response if the guid matches', () => {
          const req = angular.copy(ctrl.surveillance.requirements[1]);
          req.guiId = req.id;
          req.name = 'new name';
          ctrl.editRequirement(ctrl.surveillance.requirements[1]);
          ctrl.modalInstance.close(req);
          expect(ctrl.surveillance.requirements[1]).toEqual(req);
        });

        it('should append the response if it does not match', () => {
          ctrl.editRequirement(ctrl.surveillance.requirements[1]);
          ctrl.modalInstance.close({ guiId: 123123 });
          expect(ctrl.surveillance.requirements[1]).not.toEqual({ guiId: 123123 });
          expect(ctrl.surveillance.requirements[2]).toEqual({ guiId: 123123 });
        });

        it('should log a non-closed modal', () => {
          const logCount = $log.info.logs.length;
          ctrl.editRequirement(ctrl.surveillance.requirements[1]);
          ctrl.modalInstance.dismiss('string');
          expect($log.info.logs.length).toBe(logCount + 1);
        });
      });

      describe('when inspecting nonconformities', () => {
        let modalOptions;
        beforeEach(() => {
          modalOptions = {
            component: 'aiSurveillanceNonconformityInspect',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
              nonconformities: jasmine.any(Function),
              nonconformityTypes: jasmine.any(Function),
            },
          };
        });

        it('should create a modal instance', () => {
          expect(ctrl.modalInstance).toBeUndefined();
          ctrl.inspectNonconformities();
          expect(ctrl.modalInstance).toBeDefined();
        });

        it('should resolve elements on that modal', () => {
          const noncons = [1, 2, 3];
          ctrl.inspectNonconformities(noncons);
          expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
          expect(actualOptions.resolve.nonconformities()).toEqual(noncons);
        });
      });

      describe('when concerned with end dates', () => {
        beforeEach(() => {
          ctrl.surveillance = angular.copy(Mock.surveillances[0]);
        });

        it('should not require one when there are open NCs', () => {
          expect(ctrl.missingEndDay()).toBe(false);
        });

        it('should require one when all NCs are closed and there\'s no surveillance end date', () => {
          ctrl.surveillance.requirements[0].nonconformities[0].status = { id: 2, name: 'Closed' };
          expect(ctrl.missingEndDay()).toBe(true);
        });

        it('should require one when there are no NCs and there\'s no surveillance end date', () => {
          ctrl.surveillance.requirements[0].nonconformities = [];
          expect(ctrl.missingEndDay()).toBe(true);
        });

        it('should not require one when all NCs are closed and the surveillance has an end date', () => {
          ctrl.surveillance.requirements[0].nonconformities[0].status = { id: 2, name: 'Closed' };
          ctrl.surveillance.endDay = '2020-03-01';
          expect(ctrl.missingEndDay()).toBe(false);
        });

        it('should not require one when there are no requirements', () => {
          ctrl.surveillance.requirements = undefined;
          expect(ctrl.missingEndDay()).toBeFalsy();
        });
      });

      describe('when saving the surveillance', () => {
        beforeEach(() => {
          ctrl.workType = '';
        });

        describe('in a "confirm" workflow', () => {
          beforeEach(() => {
            ctrl.workType = 'confirm';
            ctrl.surveillance.requirements = [
              { id: 1, type: 'fake' },
              { id: 2, type: 'fake2' },
            ];
          });

          it('should close it\'s modal', () => {
            ctrl.save();
            expect(scope.close).toHaveBeenCalled();
          });

          it('should send "confirm" to the surveillance edit component', () => {
            ctrl.editRequirement(ctrl.surveillance.requirements[1]);
            expect(actualOptions.resolve.workType()).toBe('confirm');
          });
        });

        describe('in an "initiate" workflow', () => {
          beforeEach(() => {
            ctrl.workType = 'initiate';
            ctrl.surveillance.certifiedProduct.edition = undefined;
            ctrl.surveillance.certifiedProduct.certificationEdition = { name: 'fake' };
          });

          it('should set the certification edition correctly', () => {
            ctrl.surveillance.certifiedProduct.edition = undefined;
            ctrl.surveillance.certifiedProduct.certificationEdition = { name: 'fake' };
            ctrl.save();
            expect(ctrl.surveillance.certifiedProduct.edition).toBe('fake');
          });

          it('should close it\'s own modal on a status:200 response', () => {
            networkService.initiateSurveillance.and.returnValue($q.when({ status: 200 }));
            ctrl.save();
            scope.$digest();
            expect(scope.close).toHaveBeenCalledWith({ status: 200 });
          });

          it('should close it\'s own modal if no status in the response', () => {
            networkService.initiateSurveillance.and.returnValue($q.when({}));
            ctrl.save();
            scope.$digest();
            expect(scope.close).toHaveBeenCalledWith({});
          });

          it('should close it\'s own modal if status is an object in the response', () => {
            networkService.initiateSurveillance.and.returnValue($q.when({ status: { status: 'OK' } }));
            ctrl.save();
            scope.$digest();
            expect(scope.close).toHaveBeenCalledWith({ status: { status: 'OK' } });
          });

          it('should report errors if status has errors', () => {
            networkService.initiateSurveillance.and.returnValue($q.when({ status: 'bad' }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errorMessages[0].status).toBe('bad');
          });

          it('should report errors if request fails', () => {
            networkService.initiateSurveillance.and.returnValue($q.reject({ data: { errorMessages: ['errors'] } }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errorMessages).toEqual(['errors']);
          });

          it('should not report errors if request fails but no messages are returned', () => {
            networkService.initiateSurveillance.and.returnValue($q.reject({ data: { errorMessages: [] } }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errorMessages).toEqual([undefined]);
          });

          it('should not report errors if request fails but no messages are returned', () => {
            networkService.initiateSurveillance.and.returnValue($q.reject({ data: { errorMessages: undefined } }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errorMessages).toEqual([undefined]);
          });

          it('should report errors if request fails and "data.error" is returned', () => {
            networkService.initiateSurveillance.and.returnValue($q.reject({ data: { error: 'an error' } }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errorMessages).toEqual(['an error']);
          });

          it('should report errors if request fails and "statusText" is returned', () => {
            networkService.initiateSurveillance.and.returnValue($q.reject({ statusText: 'errors', data: { errorMessages: undefined } }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errorMessages).toEqual(['errors']);
          });
        });

        describe('in an "edit" workflow', () => {
          beforeEach(() => {
            ctrl.workType = 'edit';
          });

          it('should close it\'s own modal on a status:200 response', () => {
            networkService.updateSurveillance.and.returnValue($q.when({ status: 200 }));
            ctrl.save();
            scope.$digest();
            expect(scope.close).toHaveBeenCalledWith({ status: 200 });
          });

          it('should close it\'s own modal if no status in the response', () => {
            networkService.updateSurveillance.and.returnValue($q.when({}));
            ctrl.save();
            scope.$digest();
            expect(scope.close).toHaveBeenCalledWith({});
          });

          it('should close it\'s own modal if status is an object in the response', () => {
            networkService.updateSurveillance.and.returnValue($q.when({ status: { status: 'OK' } }));
            ctrl.save();
            scope.$digest();
            expect(scope.close).toHaveBeenCalledWith({ status: { status: 'OK' } });
          });

          it('should report errors if status has errors', () => {
            networkService.updateSurveillance.and.returnValue($q.when({ status: 'bad' }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errorMessages[0].status).toBe('bad');
          });

          it('should report errors if request fails', () => {
            networkService.updateSurveillance.and.returnValue($q.reject({ data: { errorMessages: ['errors'] } }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errorMessages).toEqual(['errors']);
          });

          it('should not report errors if request fails but no messages are returned', () => {
            networkService.updateSurveillance.and.returnValue($q.reject({ data: { errorMessages: [] } }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errorMessages).toEqual([undefined]);
          });

          it('should not report errors if request fails but no messages are returned', () => {
            networkService.updateSurveillance.and.returnValue($q.reject({ data: { errorMessages: undefined } }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errorMessages).toEqual([undefined]);
          });

          it('should report errors if request fails and "statusText" is returned', () => {
            networkService.updateSurveillance.and.returnValue($q.reject({ statusText: 'errors', data: { errorMessages: undefined } }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errorMessages).toEqual(['errors']);
          });
        });
      });
    });
  });
})();
