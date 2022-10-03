(() => {
  'use strict';

  describe('the surveillance inspection component', () => {
    var $compile, $log, $q, $uibModal, Mock, actualOptions, authService, ctrl, el, networkService, scope, utilService;

    beforeEach(() => {
      angular.mock.module('chpl.mock', 'chpl.components', $provide => {
        $provide.decorator('authService', $delegate => {
          $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
          return $delegate;
        });
        $provide.decorator('networkService', $delegate => {
          $delegate.confirmPendingSurveillance = jasmine.createSpy('confirmPendingSurveillance');
          $delegate.rejectPendingSurveillance = jasmine.createSpy('rejectPendingSurveillance');
          $delegate.getSurveillanceLookups = jasmine.createSpy('getSurveillanceLookups');
          return $delegate;
        });
        $provide.decorator('utilService', $delegate => {
          $delegate.sortRequirements = jasmine.createSpy('sortRequirements');
          return $delegate;
        });
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _authService_, _networkService_, _utilService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        authService = _authService_;
        authService.hasAnyRole.and.returnValue(false);
        networkService = _networkService_;
        networkService.confirmPendingSurveillance.and.returnValue($q.when([]));
        networkService.rejectPendingSurveillance.and.returnValue($q.when([]));
        networkService.getSurveillanceLookups.and.returnValue($q.when([]));
        utilService = _utilService_;
        utilService.sortRequirements.and.returnValue(1);
        Mock = _Mock_;
        $uibModal = _$uibModal_;
        spyOn($uibModal, 'open').and.callFake(options => {
          actualOptions = options;
          return Mock.fakeModal;
        });

        el = angular.element('<ai-surveillance-inspect close="close($value)" dismiss="dismiss()" resolve="resolve"></ai-surveillance-inspect>');

        scope = $rootScope.$new();
        scope.close = jasmine.createSpy('close');
        scope.dismiss = jasmine.createSpy('dismiss');
        scope.resolve = {
          surveillance: Mock.surveillances[0],
        };
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

      describe('when editing a Surveillance', () => {
        var surveillanceEditOptions;
        beforeEach(() => {
          surveillanceEditOptions = {
            component: 'aiSurveillanceEdit',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
              surveillance: jasmine.any(Function),
              surveillanceTypes: jasmine.any(Function),
              workType: jasmine.any(Function),
            },
          };
          ctrl.surveillanceTypes = {
            surveillanceRequirements: {
              criteriaOptions2014: {},
              criteriaOptions2015: {},
            },
            nonconformityTypes: {
              data: [],
            },
          };
        });

        it('should create a modal instance', () => {
          expect(ctrl.editModalInstance).toBeUndefined();
          ctrl.editSurveillance();
          expect(ctrl.editModalInstance).toBeDefined();
        });

        it('should resolve elements on that modal', () => {
          ctrl.editSurveillance();
          expect($uibModal.open).toHaveBeenCalledWith(surveillanceEditOptions);
          expect(actualOptions.resolve.surveillanceTypes()).toEqual({
            surveillanceRequirements: {
              criteriaOptions2014: {},
              criteriaOptions2015: {},
              criteriaOptions: {},
            },
            nonconformityTypes: {
              data: [],
            },
          });
          expect(actualOptions.resolve.workType()).toEqual('confirm');
        });

        it('should do stuff with the returned data', () => {
          var surveillance = { id: 1 };
          ctrl.editSurveillance();
          ctrl.editModalInstance.close(surveillance);
          expect(ctrl.surveillance).toEqual(surveillance);
        });

        it('should log a non-cancelled modal', () => {
          var logCount = $log.info.logs.length;
          ctrl.editSurveillance();
          ctrl.editModalInstance.dismiss('not cancelled');
          expect($log.info.logs.length).toBe(logCount + 1);
        });

        it('should not log a cancelled modal', () => {
          var logCount = $log.info.logs.length;
          ctrl.editSurveillance();
          ctrl.editModalInstance.dismiss('cancelled');
          expect($log.info.logs.length).toBe(logCount);
        });

        it('should pass in only the appropriate edition of requirements', () => {
          authService.hasAnyRole.and.callFake(params => params.reduce((acc, param) => { return acc || param === 'ROLE_ONC'; }, false)); // user is ONC
          ctrl.surveillanceTypes.surveillanceRequirements = {
            criteriaOptions2014: [{ removed: false }, { removed: false }, { removed: false }],
            criteriaOptions2015: [{ removed: false }, { removed: false }, { removed: true }, { removed: true }],
          };
          ctrl.surveillanceTypes.nonconformityTypes = {
            data: [{ removed: false }, { removed: false }, { removed: true }],
          };
          ctrl.surveillance.certifiedProduct.edition = '2011';
          ctrl.editSurveillance();
          expect(ctrl.surveillanceTypes.surveillanceRequirements.criteriaOptions.length).toBe(0);
          expect(ctrl.surveillanceTypes.nonconformityTypes.data.length).toBe(3);
          ctrl.surveillance.certifiedProduct.edition = '2015';
          ctrl.editSurveillance();
          expect(ctrl.surveillanceTypes.surveillanceRequirements.criteriaOptions.length).toBe(4);
          ctrl.surveillance.certifiedProduct.edition = '2014';
          ctrl.editSurveillance();
          expect(ctrl.surveillanceTypes.surveillanceRequirements.criteriaOptions.length).toBe(3);
        });

        it('should filter removed ones out if ROLE_ACB', () => {
          authService.hasAnyRole.and.callFake(params => params.reduce((acc, param) => { return acc || param === 'ROLE_ACB'; }, false)); // user is ACB
          ctrl.surveillanceTypes.surveillanceRequirements = {
            criteriaOptions2014: [{ removed: false }, { removed: false }, { removed: false }],
            criteriaOptions2015: [{ removed: false }, { removed: false }, { removed: true }, { removed: true }],
          };
          ctrl.surveillanceTypes.nonconformityTypes = {
            data: [{ removed: false }, { removed: false }, { removed: true }],
          };
          ctrl.surveillance.certifiedProduct.edition = '2011';
          ctrl.editSurveillance();
          expect(ctrl.surveillanceTypes.surveillanceRequirements.criteriaOptions.length).toBe(0);
          expect(ctrl.surveillanceTypes.nonconformityTypes.data.length).toBe(2);
          ctrl.surveillance.certifiedProduct.edition = '2015';
          ctrl.editSurveillance();
          expect(ctrl.surveillanceTypes.surveillanceRequirements.criteriaOptions.length).toBe(2);
          ctrl.surveillance.certifiedProduct.edition = '2014';
          ctrl.editSurveillance();
          expect(ctrl.surveillanceTypes.surveillanceRequirements.criteriaOptions.length).toBe(3);
        });
      });

      describe('when confirming or rejecting', () => {
        it('should close the modal if confirmation is successful', () => {
          ctrl.confirm();
          scope.$digest();
          expect(scope.close).toHaveBeenCalledWith({ status: 'confirmed' });
        });

        it('should close the modal if rejection is successful', () => {
          ctrl.reject();
          scope.$digest();
          expect(scope.close).toHaveBeenCalledWith({ status: 'rejected' });
        });

        it('should not dismiss the modal if confirmation fails', () => {
          networkService.confirmPendingSurveillance.and.returnValue($q.reject({ data: { errorMessages: [] } }));
          ctrl.confirm();
          scope.$digest();
          expect(scope.dismiss).not.toHaveBeenCalled();
        });

        it('should not dismiss the modal if rejection fails', () => {
          networkService.rejectPendingSurveillance.and.returnValue($q.reject({ data: { errorMessages: [] } }));
          ctrl.reject();
          scope.$digest();
          expect(scope.dismiss).not.toHaveBeenCalled();
        });

        it('should have error messages if confirmation fails', () => {
          networkService.confirmPendingSurveillance.and.returnValue($q.reject({ data: { errorMessages: [1, 2] } }));
          ctrl.confirm();
          scope.$digest();
          expect(ctrl.errorMessages).toEqual([1, 2]);
        });

        it('should have error messages if rejection fails', () => {
          networkService.rejectPendingSurveillance.and.returnValue($q.reject({ data: { errorMessages: [1, 2] } }));
          ctrl.reject();
          scope.$digest();
          expect(ctrl.errorMessages).toEqual([1, 2]);
        });

        it('should have error messages as statusText if confirmation fails', () => {
          networkService.confirmPendingSurveillance.and.returnValue($q.reject({ statusText: 'an error', data: {} }));
          ctrl.confirm();
          scope.$digest();
          expect(ctrl.errorMessages).toEqual(['an error']);
        });

        it('should dismiss the modal with the contact if the pending surveillance was already resolved on confirm', () => {
          var contact = { name: 'person' };
          networkService.confirmPendingSurveillance.and.returnValue($q.reject({ data: { errorMessages: [1, 2], contact: contact, objectId: 1 } }));
          ctrl.confirm();
          scope.$digest();
          expect(scope.close).toHaveBeenCalledWith({
            contact: contact,
            objectId: 1,
            status: 'resolved',
          });
        });

        it('should dismiss the modal with the contact if the pending surveillance was already resolved on reject', () => {
          var contact = { name: 'person' };
          networkService.rejectPendingSurveillance.and.returnValue($q.reject({ data: { errorMessages: [1, 2], contact: contact, objectId: 1 } }));
          ctrl.reject();
          scope.$digest();
          expect(scope.close).toHaveBeenCalledWith({
            contact: contact,
            objectId: 1,
            status: 'resolved',
          });
        });
      });

      describe('when inspecting nonconformities', () => {
        var modalOptions;
        beforeEach(() => {
          modalOptions = {
            component: 'aiSurveillanceNonconformityInspect',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
              nonconformities: jasmine.any(Function),
            },
          };
        });

        it('should create a modal instance', () => {
          expect(ctrl.modalInstance).toBeUndefined();
          ctrl.inspectNonconformities();
          expect(ctrl.modalInstance).toBeDefined();
        });

        it('should resolve elements on that modal', () => {
          var noncons = [1, 2, 3];
          ctrl.inspectNonconformities(noncons);
          expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
          expect(actualOptions.resolve.nonconformities()).toEqual(noncons);
        });
      });
    });
  });
})();
