(() => {
  describe('the CHPL Navigation', () => {
    let $compile;
    let $localStorage;
    let $location;
    let $log;
    let $q;
    let $rootScope;
    let $state;
    let authService;
    let el;
    let networkService;
    let scope;
    let vm;
    const mock = {
      username: 'a user name',
    };

    beforeEach(() => {
      angular.mock.module('chpl.navigation', ($provide) => {
        $provide.decorator('authService', ($delegate) => ({
          ...$delegate,
          getCurrentUser: jasmine.createSpy('getCurrentUser'),
          getFullname: jasmine.createSpy('getFullname'),
          getUsername: jasmine.createSpy('getUsername'),
          hasAnyRole: jasmine.createSpy('hasAnyRole'),
          isImpersonating: jasmine.createSpy('isImpersonating'),
        }));
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          getAcbs: jasmine.createSpy('getAcbs'),
          getAtls: jasmine.createSpy('getAtls'),
        }));
      });
    });

    beforeEach(inject((_$compile_, $controller, _$localStorage_, _$location_, _$log_, _$q_, _$rootScope_, _$state_, _authService_, _networkService_) => {
      $compile = _$compile_;
      $localStorage = _$localStorage_;
      $location = _$location_;
      $log = _$log_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      $state = _$state_;
      authService = _authService_;
      authService.getCurrentUser.and.returnValue({ organizations: [] });
      authService.getFullname.and.returnValue(mock.username);
      authService.getUsername.and.returnValue(mock.username);
      authService.hasAnyRole.and.returnValue(true);
      authService.isImpersonating.and.returnValue(false);

      networkService = _networkService_;
      networkService.getAcbs.and.returnValue($q.when({ acbs: [] }));
      networkService.getAtls.and.returnValue($q.when({ atls: [] }));

      scope = $rootScope.$new();
      vm = $controller('NavigationController', {
        $scope: scope,
      });
      scope.$digest();
    }));

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('directives,', () => {
      it('should compile the top', () => {
        el = angular.element('<ai-cms-widget><ai-compare-widget><ai-navigation-top></ai-navigation-top></ai-compare-widget></ai-cms-widget>');
        $compile(el)(scope);
        scope.$digest();

        expect(el.html()).not.toEqual(null);
      });

      it('should compile the bottom', () => {
        el = angular.element('<ai-navigation-bottom></ai-navigation-bottom>');
        $compile(el)(scope);
        scope.$digest();

        expect(el.html()).not.toEqual(null);
      });
    });

    describe('controller', () => {
      it('should exist', () => {
        expect(vm).toBeDefined();
      });

      it('should return the user name of the logged in user', () => {
        expect(authService.getFullname).not.toHaveBeenCalled();
        expect(vm.getFullname()).toEqual(mock.username);
        expect(authService.getFullname).toHaveBeenCalled();
      });

      it('should know what root state is active', () => {
        $state.$current.name = 'reports.listings';
        expect(vm.isActive('admininstration')).toBe(false);
        expect(vm.isActive('reports')).toBe(true);
      });

      it('should know what sub state is active', () => {
        $state.$current.name = 'reports.listings';
        expect(vm.isActive('admininstration')).toBe(false);
        expect(vm.isActive('reports.listings')).toBe(true);
      });

      xdescribe('when dealing with $broadcast,', () => {
        it('should show the CMS Widget', () => {
          spyOn(vm, 'showCmsWidget');
          scope.$apply(() => {
            $rootScope.$broadcast('ShowWidget');
          });
          expect(vm.showCmsWidget).toHaveBeenCalled();
        });

        it('should show the Compare Widget', () => {
          spyOn(vm, 'showCompareWidget');
          $rootScope.$broadcast('ShowCompareWidget').then(() => {
            expect(vm.showCompareWidget).toHaveBeenCalledWith(true);
          });
          scope.$digest();
        });

        it('should hide the Compare Widget', () => {
          spyOn(vm, 'showCompareWidget');
          $rootScope.$broadcast('HideCompareWidget');
          scope.$digest();
          expect(vm.showCompareWidget).toHaveBeenCalledWith(false);
        });
      });

      it('should clear stuff on clear', () => {
        spyOn($rootScope, '$broadcast');
        $localStorage.clearResults = undefined;
        spyOn($location, 'url');
        vm.clear();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('ClearResults', {});
        expect($localStorage.clearResults).toBe(true);
        expect($location.url).toHaveBeenCalledWith('/search');
      });

      it('should be able to toggle the CMS Widget', () => {
        expect(vm.widgetExpanded).toBeUndefined();
        vm.showCmsWidget(true);
        expect(vm.widgetExpanded).toBe(true);
        vm.showCmsWidget(false);
        expect(vm.widgetExpanded).toBe(false);
      });

      it('should be able to toggle the Compare Widget', () => {
        expect(vm.compareWidgetExpanded).toBeUndefined();
        vm.showCompareWidget(true);
        expect(vm.compareWidgetExpanded).toBe(true);
        vm.showCompareWidget(false);
        expect(vm.compareWidgetExpanded).toBe(false);
      });
    });
  });
})();
