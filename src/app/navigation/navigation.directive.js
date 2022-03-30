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

    vm.setDevelopers();

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
      vm.setDevelopers();
      if (vm.navShown) {
        vm.toggleNavClosed();
      }
    });
    $scope.$on('$destroy', loggedIn);

    const loggedOut = $scope.$on('loggedOut', () => {
      vm.setDevelopers();
      if (!vm.navShown) {
        vm.toggleNavOpen();
      }
    });
    $scope.$on('$destroy', loggedOut);

    const impersonating = $scope.$on('impersonating', () => {
      vm.setDevelopers();
    });
    $scope.$on('$destroy', impersonating);

    const unimpersonating = $scope.$on('unimpersonating', () => {
      vm.setDevelopers();
    });
    $scope.$on('$destroy', unimpersonating);

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

  function setDevelopers() {
    if (vm.hasAnyRole(['ROLE_DEVELOPER'])) {
      vm.developers = authService.getCurrentUser().organizations.map((developer) => developer);
    } else {
      vm.developers = [];
    }
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
  vm.getFullname = authService.getFullname;
  vm.isActive = isActive;
  vm.isOn = featureFlags.isOn;
  vm.hasAnyRole = authService.hasAnyRole;
  vm.logout = authService.logout;
  vm.setDevelopers = setDevelopers;
  vm.showCmsWidget = showCmsWidget;
  vm.showCompareWidget = showCompareWidget;
  vm.toggleNavClosed = toggleNavClosed;
  vm.toggleNavOpen = toggleNavOpen;
}

angular.module('chpl.navigation')
  .directive('aiNavigationTop', aiNavigationTop)
  .controller('NavigationController', NavigationController);
