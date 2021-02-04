(() => {
  'use strict';

  describe('the developer inspection component', () => {
    let $compile, $log, $q, ctrl, el, mock, networkService, scope;

    mock = {
      listing: {
        developer: { developerId: 1},
        transparencyAttestation: 'Affirmative',
        certifyingBody: {
          code: '04',
          name: 'Drummond Group',
          id: 3,
        },
      },
      developer: {
        address: {},
      },
      resources: {
        bodies: [],
        classifications: [],
        practices: [],
        qmsStandards: [],
        accessibilityStandards: [],
        targetedUsers: [],
        statuses: [],
        testingLabs: [],
      },
    };

    beforeEach(() => {
      angular.mock.module('chpl.components', $provide => {
        $provide.decorator('networkService', $delegate => {
          $delegate.updateDeveloper = jasmine.createSpy('updateDeveloper');

          return $delegate;
        });
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        networkService = _networkService_;
        networkService.updateDeveloper.and.returnValue($q.when({}));

        scope = $rootScope.$new();
        scope.listing = mock.listing;
        scope.developer = mock.developer;

        el = angular.element('<ai-inspect-developer listing="listing" developer="developer"></ai-inspect-developer>');
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

    describe('directive', () => {
      it('should be compiled', () => {
        expect(el.html()).not.toEqual(null);
      });
    });

    describe('controller', () => {
      it('should exist', () => {
        expect(ctrl).toBeDefined();
      });

      describe('when saving new developer', () => {
        it('should call the network service', () => {
          ctrl.listing.developer = angular.copy(ctrl.developer);
          ctrl.saveInspectingDeveloper();
          scope.$digest();
          expect(networkService.updateDeveloper).toHaveBeenCalled();
        });
      });
    });
  });
})();
