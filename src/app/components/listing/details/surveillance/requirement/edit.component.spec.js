(() => {
  'use strict';

  describe('the surveillance requirement edit component', () => {
    var $compile, $log, $uibModal, Mock, actualOptions, authService, ctrl, el, scope;

    beforeEach(() => {
      angular.mock.module('chpl.mock', 'chpl.components', $provide => {
        $provide.decorator('authService', $delegate => {
          $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
          return $delegate;
        });
      });

      inject((_$compile_, _$log_, $rootScope, _$uibModal_, _Mock_, _authService_) => {
        $compile = _$compile_;
        $log = _$log_;
        Mock = _Mock_;
        authService = _authService_;
        authService.hasAnyRole.and.returnValue(false);
        $uibModal = _$uibModal_;
        spyOn($uibModal, 'open').and.callFake(options => {
          actualOptions = options;
          return Mock.fakeModal;
        });

        el = angular.element('<ai-surveillance-requirement-edit close="close($value)" dismiss="dismiss()" resolve="resolve"></ai-surveillance-requirement-edit>');

        scope = $rootScope.$new();
        scope.close = jasmine.createSpy('close');
        scope.dismiss = jasmine.createSpy('dismiss');
        scope.resolve = {
          disableValidation: false,
          randomized: false,
          randomizedSitesUsed: 34,
          requirement: {},
          surveillanceId: 1,
          surveillanceTypes: {
            surveillanceRequirements: {
              criteriaOptions: [],
            },
          },
          workType: 'create',
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

      it('should be able to determine if Non-confirmity Type is removed', () => {
        ctrl.data = Mock.surveillanceData;
        let removed = ctrl.isNonconformityTypeRemoved('170.523 (k)(1)');
        expect(removed).toBeFalse();
        removed = ctrl.isNonconformityTypeRemoved('170.523 (k)(2)');
        expect(removed).toBeTrue();
      });

      describe('when adding a Nonconformity', () => {
        var modalOptions;
        beforeEach(() => {
          modalOptions = {
            component: 'aiSurveillanceNonconformityEdit',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
              disableValidation: jasmine.any(Function),
              nonconformity: jasmine.any(Function),
              randomized: jasmine.any(Function),
              randomizedSitesUsed: jasmine.any(Function),
              requirementId: jasmine.any(Function),
              surveillanceId: jasmine.any(Function),
              surveillanceTypes: jasmine.any(Function),
              workType: jasmine.any(Function),
            },
          };
          ctrl.data = {
            nonconformityTypes: {
              data: [],
            },
          };
        });

        it('should create a modal instance', () => {
          expect(ctrl.modalInstance).toBeUndefined();
          ctrl.addNonconformity();
          expect(ctrl.modalInstance).toBeDefined();
        });

        it('should resolve elements', () => {
          ctrl.addNonconformity();
          expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
          expect(actualOptions.resolve.disableValidation()).toBe(false);
          expect(actualOptions.resolve.nonconformity()).toEqual({});
          expect(actualOptions.resolve.randomized()).toEqual(ctrl.randomized);
          expect(actualOptions.resolve.randomizedSitesUsed()).toEqual(ctrl.randomizedSitesUsed);
          expect(actualOptions.resolve.requirementId()).toEqual(ctrl.requirement.id);
          expect(actualOptions.resolve.surveillanceId()).toEqual(ctrl.surveillanceId);
          expect(actualOptions.resolve.surveillanceTypes()).toEqual(ctrl.data);
          expect(actualOptions.resolve.workType()).toBe('add');
        });

        it('should push the result to the list of nonconformities', () => {
          ctrl.addNonconformity();
          ctrl.requirement.nonconformities = [];
          ctrl.modalInstance.close({});
          expect(ctrl.requirement.nonconformities).toEqual([{}]);
        });

        it('should create an array of nonconformities if it doesn\'t exist', () => {
          ctrl.addNonconformity();
          ctrl.modalInstance.close({});
          expect(ctrl.requirement.nonconformities).toEqual([{}]);
        });

        it('should log a dismissed modal', () => {
          var logCount = $log.info.logs.length;
          ctrl.addNonconformity();
          ctrl.modalInstance.dismiss('dismissed');
          expect($log.info.logs.length).toBe(logCount + 1);
        });

        it('should filter out removed criteria when user is ROLE_ACB', () => {
          authService.hasAnyRole.and.callFake(params => params.reduce((acc, param) => { return acc || param === 'ROLE_ACB'; }, false)); // user is ACB
          ctrl.data = {
            nonconformityTypes: {
              data: [{ removed: false }, { removed: false }, { removed: true }],
            },
          };
          ctrl.addNonconformity();
          expect(actualOptions.resolve.surveillanceTypes().nonconformityTypes.data.length).toBe(2);
        });

        it('should not change base data', () => {
          authService.hasAnyRole.and.callFake(params => params.reduce((acc, param) => { return acc || param === 'ROLE_ACB'; }, false)); // user is ACB
          ctrl.data = {
            nonconformityTypes: {
              data: [{ removed: false }, { removed: false }, { removed: true }],
            },
          };
          ctrl.addNonconformity();
          expect(ctrl.data.nonconformityTypes.data.length).toBe(3);
        });

        it('should not filter out removed criteria when user is ROLE_ACB', () => {
          authService.hasAnyRole.and.callFake(params => params.reduce((acc, param) => { return acc || param === 'ROLE_ONC'; }, false)); // user is ACB
          ctrl.data = {
            nonconformityTypes: {
              data: [{ removed: false }, { removed: false }, { removed: true }],
            },
          };
          ctrl.addNonconformity();
          expect(actualOptions.resolve.surveillanceTypes().nonconformityTypes.data.length).toBe(3);
        });
      });

      describe('when editing a Nonconformity', () => {
        var modalOptions, noncon;
        beforeEach(() => {
          noncon = { id: 1, name: '1' };
          modalOptions = {
            component: 'aiSurveillanceNonconformityEdit',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
              disableValidation: jasmine.any(Function),
              nonconformity: jasmine.any(Function),
              randomized: jasmine.any(Function),
              randomizedSitesUsed: jasmine.any(Function),
              requirementId: jasmine.any(Function),
              surveillanceId: jasmine.any(Function),
              surveillanceTypes: jasmine.any(Function),
              workType: jasmine.any(Function),
            },
          };
        });

        it('should create a modal instance', () => {
          expect(ctrl.modalInstance).toBeUndefined();
          ctrl.editNonconformity(noncon);
          expect(ctrl.modalInstance).toBeDefined();
        });

        it('should resolve elements', () => {
          ctrl.editNonconformity(noncon);
          expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
          expect(actualOptions.resolve.disableValidation()).toBe(false);
          expect(actualOptions.resolve.nonconformity()).toEqual(noncon);
          expect(actualOptions.resolve.randomized()).toEqual(ctrl.randomized);
          expect(actualOptions.resolve.randomizedSitesUsed()).toEqual(ctrl.randomizedSitesUsed);
          expect(actualOptions.resolve.requirementId()).toEqual(ctrl.requirement.id);
          expect(actualOptions.resolve.surveillanceId()).toEqual(ctrl.surveillanceId);
          expect(actualOptions.resolve.surveillanceTypes()).toEqual(ctrl.data);
          expect(actualOptions.resolve.workType()).toBe('create');
        });

        it('should generate a guiId if one doesn\'t exist', () => {
          var empty = {};
          expect(empty.guiId).toBeUndefined();
          ctrl.editNonconformity(empty);
          expect(empty.guiId).toBeDefined();
        });

        it('should replace the result in the list of nonconformities if it was already there', () => {
          ctrl.editNonconformity(noncon);
          ctrl.requirement.nonconformities = [noncon];
          ctrl.modalInstance.close({ id: 1, name: '2', guiId: 1 });
          expect(ctrl.requirement.nonconformities).toEqual([{ id: 1, name: '2', guiId: 1 }]);
        });

        it('should add the result to the list of nonconformities if it was not there', () => {
          ctrl.editNonconformity(noncon);
          ctrl.requirement.nonconformities = [noncon];
          ctrl.modalInstance.close({ id: 2 });
          expect(ctrl.requirement.nonconformities).toEqual([{ id: 1, name: '1', guiId: 1 }, { id: 2 }]);
        });

        it('should log a dismissed modal', () => {
          var logCount = $log.info.logs.length;
          ctrl.editNonconformity(noncon);
          ctrl.modalInstance.dismiss('dismissed');
          expect($log.info.logs.length).toBe(logCount + 1);
        });
      });

      describe('when deleting nonconformities', () => {
        it('should delete them', () => {
          ctrl.requirement.nonconformities = [{ id: 1 }, { id: 2 }];
          ctrl.deleteNonconformity(ctrl.requirement.nonconformities[1]);
          expect(ctrl.requirement.nonconformities).toEqual([ctrl.requirement.nonconformities[0]]);
        });
      });

      describe('when determining if a noncon requires requirements', () => {
        it('should be if the result is NC & nonconformites are undefined', () => {
          ctrl.requirement.result = { name: 'Non-Conformity' };
          expect(ctrl.isNonconformityRequired()).toBe(true);
        });

        it('should be if the result is NC & nonconformity length is 0', () => {
          ctrl.requirement.result = { name: 'Non-Conformity' };
          ctrl.requirement.nonconformities = [];
          expect(ctrl.isNonconformityRequired()).toBe(true);
        });

        it('should not be if the result is NC & nonconformity length is 0', () => {
          ctrl.requirement.result = { name: 'Non-Conformity' };
          ctrl.requirement.nonconformities = [{}];
          expect(ctrl.isNonconformityRequired()).toBe(false);
        });
        it('should not be if the result is not NC', () => {
          ctrl.requirement.result = { name: 'No Non-Conformity' };
          expect(ctrl.isNonconformityRequired()).toBe(false);
        });
      });

      describe('when saving the requirement', () => {
        it('should close the modal with the active requirement', () => {
          var activeReq = {
            id: 'something',
            result: { name: 'someting' },
            type: { name: 'something' },
          };
          ctrl.requirement = activeReq;
          ctrl.save();
          expect(scope.close).toHaveBeenCalledWith(activeReq);
        });

        it('should remove any requirements if there was no NC found', () => {
          var activeReq = {
            id: 'something',
            result: { name: 'No Non-Conformity' },
            type: { name: 'No Non-Conformity' },
            nonconformities: [1, 2, 3],
          };
          ctrl.requirement = activeReq;
          ctrl.save();
          expect(activeReq.nonconformities).toEqual([]);
        });
      });
    });
  });
})();
