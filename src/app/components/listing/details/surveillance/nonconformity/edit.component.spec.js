(() => {
  describe('the surveillance nonconformity edit component', () => {
    let $compile;
    let $log;
    let $q;
    let authService;
    let ctrl;
    let el;
    let networkService;
    let scope;

    beforeEach(() => {
      angular.mock.module('chpl.components', ($provide) => {
        $provide.decorator('authService', ($delegate) => ({
          ...$delegate,
          getApiKey: jasmine.createSpy('getApiKey'),
          getToken: jasmine.createSpy('getToken'),
        }));
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          deleteSurveillanceDocument: jasmine.createSpy('deleteSurveillanceDocument'),
        }));
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _authService_, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        authService = _authService_;
        authService.getApiKey.and.returnValue('api-key');
        authService.getToken.and.returnValue('token');
        networkService = _networkService_;
        networkService.deleteSurveillanceDocument.and.returnValue($q.when({}));

        el = angular.element('<ai-surveillance-nonconformity-edit close="close($value)" dismiss="dismiss()" resolve="resolve"></ai-surveillance-nonconformity-edit>');

        scope = $rootScope.$new();
        scope.close = jasmine.createSpy('close');
        scope.dismiss = jasmine.createSpy('dismiss');
        scope.resolve = {
          disableValidation: false,
          nonconformity: {},
          randomized: false,
          randomizedSitesUsed: undefined,
          requirementId: 1,
          surveillanceId: 1,
          surveillanceTypes: {
            nonconformityTypes: { data: [] },
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
        console.debug(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
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

      it('should be able close it\'s own modal', () => {
        expect(ctrl.cancel).toBeDefined();
        ctrl.cancel();
        expect(scope.dismiss).toHaveBeenCalled();
      });

      describe('when deleting a document', () => {
        beforeEach(() => {
          ctrl.surveillanceId = 1;
          ctrl.nonconformity = { id: 2 };
          ctrl.nonconformity.documents = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
          ];
        });

        it('should call the common service', () => {
          ctrl.deleteDoc(3);
          scope.$digest();
          expect(networkService.deleteSurveillanceDocument).toHaveBeenCalledWith(1, 3);
        });

        it('should remove the deleted document from the list', () => {
          ctrl.deleteDoc(3);
          scope.$digest();
          expect(ctrl.nonconformity.documents.length).toBe(2);
        });

        it('should handle failure', () => {
          networkService.deleteSurveillanceDocument.and.returnValue($q.reject({ data: {} }));
          ctrl.deleteDoc(3);
          scope.$digest();
          expect(ctrl.deleteMessage).toBe('File was not removed successfully.');
          expect(ctrl.deleteSuccess).toBe(false);
        });
      });

      describe('when saving the nonconformity', () => {
        it('should close it\'s modal with the NC', () => {
          ctrl.nonconformity = { id: 'an NC' };
          ctrl.save();
          expect(scope.close).toHaveBeenCalled();
        });
      });
    });
  });
})();
