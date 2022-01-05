(() => {
  'use strict';

  xdescribe('the G1/G2 edit component', () => {

    var $compile, $log, ManageList, Mock, ctrl, el, scope;

    beforeEach(() => {
      angular.mock.module('chpl.components', 'chpl.mock', 'chpl.services');

      inject((_$compile_, _$log_, $rootScope, _ManageList_, _Mock_) => {
        $compile = _$compile_;
        $log = _$log_;
        ManageList = _ManageList_;
        Mock = _Mock_;

        scope = $rootScope.$new();
        scope.measures = Mock.listingMeasures;
        scope.onChange = jasmine.createSpy('onChange');
        scope.resources = {
          measures: { data: Mock.measures },
          measureTypes: { data: Mock.measureTypes },
        };
        el = angular.element('<chpl-g1g2-edit measures="measures" on-change="onChange(measures)" resources="resources"></chpl-g1g2-edit>');

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
      it('should have isolate scope object with instanciate members', () => {
        expect(ctrl).toEqual(jasmine.any(Object));
      });

      it('should call the callback on update', () => {
        ctrl.update();
        expect(scope.onChange).toHaveBeenCalled();
      });

      it('should generate a list of available tests', () => {
        expect(ctrl.allTests).toEqual(['RT1', 'RT3', 'RT10']);
      });

      it('should generate a list of available measure types', () => {
        expect(ctrl.allTypes).toEqual([{ name: 'G1' }, { name: 'G2' }]);
      });

      describe('when sorting', () => {
        let a, b;

        describe('measure results', () => {
          beforeEach(() => {
            a = angular.copy(Mock.listingMeasures[0]);
            b = angular.copy(Mock.listingMeasures[0]);
          });

          it('should not sort identical ones', () => {
            expect(ctrl.measureSort(a, b)).toBe(0);
          });

          it('should sort removed last', () => {
            b.measure.removed = true;
            expect(ctrl.measureSort(a, b)).toBe(-1);
            expect(ctrl.measureSort(b, a)).toBe(1);
          });

          it('should sort by g1/g2', () => {
            b.measureType.name = 'G2';
            expect(ctrl.measureSort(a, b)).toBe(-1);
            expect(ctrl.measureSort(b, a)).toBe(1);
          });

          it('should sort by domain', () => {
            b.measure.domain.name = 'Medicaid';
            expect(ctrl.measureSort(a, b)).toBe(-1);
            expect(ctrl.measureSort(b, a)).toBe(1);
          });

          it('should sort by test', () => {
            b.measure.abbreviation = 'RT2';
            expect(ctrl.measureSort(a, b)).toBe(-1);
            expect(ctrl.measureSort(b, a)).toBe(1);
          });

          it('should sort by test, ignoring the RT part', () => {
            a.measure.abbreviation = 'RT2';
            b.measure.abbreviation = 'RT10';
            expect(ctrl.measureSort(a, b)).toBe(-1);
            expect(ctrl.measureSort(b, a)).toBe(1);
          });

          it('should sort by name', () => {
            b.measure.name = 'Never done sorting';
            expect(ctrl.measureSort(a, b)).toBe(-1);
            expect(ctrl.measureSort(b, a)).toBe(1);
          });
        });

        describe('available measures', () => {
          beforeEach(() => {
            a = angular.copy(Mock.measures[0]);
            b = angular.copy(Mock.measures[0]);
          });

          it('should not sort identical ones', () => {
            expect(ctrl.measureSort(a, b)).toBe(0);
          });

          it('should sort removed last', () => {
            b.removed = true;
            expect(ctrl.measureSort(a, b)).toBe(-1);
            expect(ctrl.measureSort(b, a)).toBe(1);
          });

          it('should sort by domain', () => {
            b.domain.name = 'Medicaid';
            expect(ctrl.measureSort(a, b)).toBe(-1);
            expect(ctrl.measureSort(b, a)).toBe(1);
          });

          it('should sort by test', () => {
            b.abbreviation = 'RT2';
            expect(ctrl.measureSort(a, b)).toBe(-1);
            expect(ctrl.measureSort(b, a)).toBe(1);
          });

          it('should sort by test, ignoring the RT part', () => {
            a.abbreviation = 'RT2';
            b.abbreviation = 'RT10';
            expect(ctrl.measureSort(a, b)).toBe(-1);
            expect(ctrl.measureSort(b, a)).toBe(1);
          });

          it('should sort by name', () => {
            b.name = 'Never done sorting';
            expect(ctrl.measureSort(a, b)).toBe(-1);
            expect(ctrl.measureSort(b, a)).toBe(1);
          });
        });
      });

      describe('when filtering available measures', () => {
        it('should filter out ones that don\'t have the required test', () => {
          ctrl.ManageList.newItem['measures'] = { selectedAbbreviation: 'RT1' };
          ctrl.updateAllowedMeasures();
          expect(ctrl.allowedMeasures.length).toBe(1);
        });
      });

      describe('while managing measures', () => {
        it('should allow cancellation', () => {
          let type = 'fizz';
          spyOn(ManageList, 'cancel');
          ctrl.allowedMeasures = [1, 2];
          ctrl.cancelNewItem(type);
          expect(ManageList.cancel).toHaveBeenCalledWith(type);
          expect(ctrl.allowedMeasures).toEqual([]);
        });

        it('should support removing measures', () => {
          let init = ctrl.measures.length;
          ctrl.removeItem(Mock.listingMeasures[1]);
          expect(ctrl.measures.length).toBe(init - 1);
        });

        it('should save new measures', () => {
          spyOn(ctrl, 'update');
          spyOn(ManageList, 'add');
          ManageList.newItem['measures'] = { measure: {} };
          ctrl.saveNewItem();
          expect(ctrl.update).toHaveBeenCalled();
          expect(ManageList.add).toHaveBeenCalledWith('measures', jasmine.any(Function));
        });

        it('should update the newItem data on save', () => {
          ManageList.newItem['measures'] = { measure: {} };
          ManageList.newItem['measures'].typeName = 'G1';
          spyOn(ManageList, 'add').and.stub();
          ctrl.saveNewItem();
          expect(ManageList.newItem['measures'].type.name).toBe('G1');
        });
      });
    });
  });
})();
