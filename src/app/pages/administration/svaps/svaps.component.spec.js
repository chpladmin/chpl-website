(() => {
  'use strict';

  describe('the SVAP Administration page', () => {
    let $compile, $log, $q, Mock, ctrl, el, networkService, scope;

    beforeEach(() => {
      angular.mock.module('chpl.administration', 'chpl.mock', $provide => {
        $provide.decorator('networkService', $delegate => {
          $delegate.deleteSvap = jasmine.createSpy('deleteSvap');
          $delegate.updateSvap = jasmine.createSpy('updateSvap');
          $delegate.createSvap = jasmine.createSpy('createSvap');
          $delegate.getSvaps = jasmine.createSpy('getSvaps');
          return $delegate;
        });
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _Mock_, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        Mock = _Mock_;
        networkService = _networkService_;
        networkService.deleteSvap.and.returnValue($q.when({}));
        networkService.updateSvap.and.returnValue($q.when({}));
        networkService.createSvap.and.returnValue($q.when({}));
        networkService.getSvaps.and.returnValue($q.when({}));

        scope = $rootScope.$new();
        scope.svaps = Mock.svaps;
        scope.availableCriteria = Mock.availableCriteria;

        el = angular.element('<chpl-svaps-page svaps="svaps" available-criteria="availableCriteria"></chpl-svaps-page>');

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

      describe('during initiation', () => {
        it('should have constructed stuff', () => {
          expect(ctrl.$log).toBeDefined();
        });

        it('should do things $onChanges', () => {
          expect(ctrl.svaps).toBeDefined();
          expect(ctrl.svaps.length).toBe(2);
          expect(ctrl.availableCriteria).toBeDefined();
          expect(ctrl.availableCriteria.length).toBe(4);
        });
      });

      describe('when entering add mode', () => {
        beforeEach(() => {
          ctrl.svap = null;
          ctrl.isEditing = false;
          ctrl.errors = [1, 2];
          ctrl.addSvap();
        });

        it('should add a new svap object', () => {
          expect(ctrl.svap).toEqual({criteria: []});
        });

        it('should clear any existing errors', () => {
          expect(ctrl.errors.length).toBe(0);
        });

        it('should set mode to editing', () => {
          expect(ctrl.isEditing).toBe(true);
        });
      });

      describe('when deleting an svap', () => {
        beforeEach(() => {
          ctrl.svap = { svapId: 3 };
          ctrl.isEditing = true;
          ctrl.delete();
        });

        it('should call the svap delete endpoint', () => {
          expect(networkService.deleteSvap).toHaveBeenCalledWith(ctrl.svap);
        });
      });

      describe('when entering edit mode', () => {
        beforeEach(() => {
          ctrl.isEditing = true;
          ctrl.editSvap(Mock.svaps[1]);
        });

        it('should set the selected svap', () => {
          expect(ctrl.svap).toEqual(Mock.svaps[1]);
        });

        it('should clear any existing errors', () => {
          expect(ctrl.errors.length).toBe(0);
        });

        it('should set mode to editing', () => {
          expect(ctrl.isEditing).toBe(true);
        });
      });

      describe('when cancelling out of edit or adding of svap', () => {
        beforeEach(() => {
          ctrl.isEditing = true;
          ctrl.svap = { svapId: 3 };
          ctrl.cancel();
        });

        it('should reset the current svap', () => {
          expect(ctrl.svap).toBeNull();
        });

        it('should set mode to editing', () => {
          expect(ctrl.isEditing).toBe(false);
        });

        it('should refresh the list of svaps', () => {
          expect(networkService.getSvaps).toHaveBeenCalledTimes(1);
        });
      });

      describe('when saving', () => {
        describe('when editing an svap', () => {
          beforeEach(() => {
            ctrl.isEditing = true;
            ctrl.svap = { svapId: 3, criteria: []};
            ctrl.errors = null;
          });

          it('should call the update svap endpoint', () => {
            ctrl.save();
            expect(networkService.updateSvap).toHaveBeenCalledTimes(1);
          });

          it('should call the update svap endpoint', () => {
            ctrl.save();
            expect(networkService.updateSvap).toHaveBeenCalledTimes(1);
          });

          xit('should cancel out of edit mode on success', () => {
            scope.cancel = jasmine.createSpy('cancel');
            networkService.updateSvap.and.returnValue($q.when({ status: 200 }));
            ctrl.save();
            scope.$digest();
            expect(scope.cancel).toHaveBeenCalled();
          });

          it('should set the errors on failure', () => {
            networkService.updateSvap.and.returnValue($q.reject({ data: { errorMessages: ['errors'] } }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errors.length).toEqual(1);
          });
        });

        describe('when adding an svap', () => {
          beforeEach(() => {
            ctrl.isEditing = true;
            ctrl.svap = { regulatoryTextCitation: 'this is some text', criteria: [] };
            ctrl.errors = null;
          });

          it('should call the create svap endpoint', () => {
            ctrl.save();
            expect(networkService.createSvap).toHaveBeenCalledTimes(1);
          });

          xit('should cancel out of edit mode on success', () => {
            scope.cancel = jasmine.createSpy('cancel');
            networkService.createSvap.and.returnValue($q.when({ status: 200 }));
            ctrl.save();
            scope.$digest();
            expect(scope.cancel).toHaveBeenCalled();
          });

          it('should set the errors on failure', () => {
            networkService.createSvap.and.returnValue($q.reject({ data: { errorMessages: ['errors'] } }));
            ctrl.save();
            scope.$digest();
            expect(ctrl.errors.length).toEqual(1);
          });
        });

        describe('when getting the list of available criteria', () => {
          it('should return the whole available list when there is no current svap', () => {
            ctrl.svap = null;
            ctrl.availableCriteria = angular.copy(Mock.availableCriteria);
            expect(ctrl.getCriteriaForSelectableList().length).toBe(4);
          });

          it('should return the whole available list when there are no criteria associated with current svap', () => {
            ctrl.svap = { criteria: [] };
            ctrl.availableCriteria = angular.copy(Mock.availableCriteria);
            expect(ctrl.getCriteriaForSelectableList().length).toBe(4);
          });

          it('should return the available list, without the criteria associated to the current svap', () => {
            ctrl.svap = angular.copy(Mock.svaps[0]);
            ctrl.availableCriteria = angular.copy(Mock.availableCriteria);
            expect(ctrl.getCriteriaForSelectableList().length).toBe(2);
          });
        });

        describe('when removing a criteria from the current svap', () => {
          it('should remove the criteria from the list', () => {
            ctrl.svap = angular.copy(Mock.svaps[0]);
            ctrl.removeCriteriaFromSvap(angular.copy(Mock.availableCriteria[0]));
            expect(ctrl.svap.criteria.length).toBe(1);
          });

          it('should do nothing if the criteria is not in the current svap', () => {
            ctrl.svap = angular.copy(Mock.svaps[0]);
            ctrl.removeCriteriaFromSvap(angular.copy(Mock.availableCriteria[3]));
            expect(ctrl.svap.criteria.length).toBe(2);
          });
        });

        describe('when a criteria is selected', () => {
          it('should be added to the current svap', () => {
            ctrl.svap = angular.copy(Mock.svaps[0]);
            ctrl.selectCriteriaForSvap(angular.copy(Mock.availableCriteria[3]));
            expect(ctrl.svap.criteria.length).toBe(3);
          });

          it('should clear out the currently selected criteria', () => {
            ctrl.svap = angular.copy(Mock.svaps[0]);
            ctrl.selectCriteriaForSvap(angular.copy(Mock.availableCriteria[3]));
            expect(ctrl.selectedCriteria).toBeNull();
          });
        });
      });
    });
  });
})();
