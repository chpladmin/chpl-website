/** @ngInject */
function aiNavigationTop() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'chpl.navigation/navigation-top.html',
    bindToController: {
      widget: '=?',
      compareWidget: '=?',
    },
    scope: { },
    controllerAs: 'vm',
    controller: 'NavigationController',
  };
}

/** @ngInject */
function NavigationController($localStorage, $location, $log, $rootScope, $scope, $state, authService, featureFlags) {
  const vm = this;

  this.$onInit = () => {
    $rootScope.bodyClass = 'navigation-shown';

    if (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
      vm.toggleNavClosed();
    } else {
      vm.toggleNavOpen();
    }

    const showCmsWidgetHook = $rootScope.$on('ShowWidget', () => {
      vm.showCmsWidget(true);
      if (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
        vm.toggleNavOpen();
      }
    });
    $scope.$on('$destroy', showCmsWidgetHook);

    const hideCmsWidget = $rootScope.$on('HideWidget', () => {
      vm.showCmsWidget(false);
    });
    $scope.$on('$destroy', hideCmsWidget);

    const showCompareWidgetHook = $rootScope.$on('ShowCompareWidget', () => {
      vm.showCompareWidget(true);
      if (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
        vm.toggleNavOpen();
      }
    });
    $scope.$on('$destroy', showCompareWidgetHook);

    const hideCompareWidget = $rootScope.$on('HideCompareWidget', () => {
      vm.showCompareWidget(false);
    });
    $scope.$on('$destroy', hideCompareWidget);

    const loggedIn = $scope.$on('loggedIn', () => {
      if (vm.navShown) {
        vm.toggleNavClosed();
      }
    });
    $scope.$on('$destroy', loggedIn);

    const loggedOut = $scope.$on('loggedOut', () => {
      if (!vm.navShown) {
        vm.toggleNavOpen();
      }
    });
    $scope.$on('$destroy', loggedOut);

    const flags = $rootScope.$on('flags loaded', () => {
      if (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
        vm.toggleNavClosed();
      }
    });
    $scope.$on('$destroy', flags);

    const logout = $scope.$on('IdleTimeout', () => {
      vm.logout();
    });
    $scope.$on('$destroy', logout);
  };

  function clear() {
    $rootScope.$broadcast('ClearResults', {});
    $localStorage.clearResults = true;
    $location.url('/search');
  }

  function isActive(state) {
    return $state.$current.name.startsWith(state);
  }

  function getDevelopers() {
    if (vm.hasAnyRole(['ROLE_DEVELOPER'])) {
      return authService.getCurrentUser().organizations
        .map((developer) => developer)
        .sort((a, b) => (a.name < b.name ? -1 : 1));
    }
    return [];
  }

  function showCmsWidget(show) {
    vm.widgetExpanded = show;
  }

  function showCompareWidget(show) {
    vm.compareWidgetExpanded = show;
  }

  function toggleNavClosed() {
    vm.navShown = false;
    $rootScope.bodyClass = 'navigation-hidden';
  }

  function toggleNavOpen() {
    vm.navShown = true;
    $rootScope.bodyClass = 'navigation-shown';
  }

  vm.clear = clear;
  vm.getDevelopers = getDevelopers;
  vm.getFullname = authService.getFullname;
  vm.hasAnyRole = authService.hasAnyRole;
  vm.isActive = isActive;
  vm.isOn = featureFlags.isOn;
  vm.logout = authService.logout;
  vm.showCmsWidget = showCmsWidget;
  vm.showCompareWidget = showCompareWidget;
  vm.toggleNavClosed = toggleNavClosed;
  vm.toggleNavOpen = toggleNavOpen;
}

angular.module('chpl.navigation')
  .directive('aiNavigationTop', aiNavigationTop)
  .controller('NavigationController', NavigationController);
