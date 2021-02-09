(() => {
  'use strict';

  describe('the Version Merge component', () => {
    var $compile, $log, $q, $state, ctrl, el, mock, networkService, scope;

    mock = {
      developer: {
        developerId: 22,
        products: [{
          productId: 32,
          versions: [{versionId: 55}, {versionId: 77}, {versionId: 99}],
        }],
      },
      stateParams: {
        developerId: 22,
        productId: 32,
        versionId: 55,
      },
    };

    beforeEach(() => {
      angular.mock.module('chpl.organizations', $provide => {
        $provide.factory('$stateParams', () => mock.stateParams);
        $provide.factory('chplVersionEditDirective', () => ({}));
        $provide.decorator('networkService', $delegate => {
          $delegate.updateVersion = jasmine.createSpy('updateVersion');
          return $delegate;
        });
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _$state_, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        $state = _$state_;
        networkService = _networkService_;
        networkService.updateVersion.and.returnValue($q.when({
          version: 'a version',
          versionId: 32,
        }));

        scope = $rootScope.$new();
        scope.developer = mock.developer;

        el = angular.element('<chpl-versions-merge developer="developer"></chpl-versions-merge>');

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
    });

    describe('when a version merge is saved', () => {
      it('should navigate back to the developer on a good response', () => {
        spyOn($state, 'go');
        let version = { versionId: 55 };
        ctrl.selectedVersions = [{versionId: 77}];
        networkService.updateVersion.and.returnValue($q.when({versionId: 200}));
        ctrl.merge(version);
        scope.$digest();
        expect($state.go).toHaveBeenCalledWith(
          'organizations.developers.developer',
          { developerId: 22 },
          { reload: true },
        );
      });

      it('should pass the the merging version data to the network service', () => {
        let version = { versionId: 55 };
        ctrl.selectedVersions = [{versionId: 77}];
        networkService.updateVersion.and.returnValue($q.when({versionId: 200}));
        ctrl.merge(version);
        expect(networkService.updateVersion).toHaveBeenCalledWith({
          version: version,
          versionIds: [77, 55],
          newProductId: 32,
        });
      });
    });
  });
})();
