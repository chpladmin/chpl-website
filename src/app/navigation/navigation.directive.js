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

    if (vm.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'ROLE_CMS_STAFF', 'chpl-developer'])) {
      vm.toggleNavClosed();
    } else {
      vm.toggleNavOpen();
    }

    const showCmsWidgetHook = $rootScope.$on('ShowCmsWidget', () => {
      vm.showCmsWidget(true);
      if (vm.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'ROLE_CMS_STAFF', 'chpl-developer'])) {
        vm.toggleNavOpen();
      }
    });
    $scope.$on('$destroy', showCmsWidgetHook);

    const hideCmsWidget = $rootScope.$on('HideCmsWidget', () => {
      vm.showCmsWidget(false);
    });
    $scope.$on('$destroy', hideCmsWidget);

    const showCompareWidgetHook = $rootScope.$on('ShowCompareWidget', () => {
      vm.showCompareWidget(true);
      if (vm.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'ROLE_CMS_STAFF', 'chpl-developer'])) {
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
      if (vm.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'ROLE_CMS_STAFF', 'chpl-developer'])) {
        vm.toggleNavClosed();
      }
    });
    $scope.$on('$destroy', flags);

    const logout = $scope.$on('IdleTimeout', () => {
      vm.logout();
    });
    $scope.$on('$destroy', logout);
  };

  function isActive(state) {
    return $state.$current.name.startsWith(state);
  }

  function getDevelopers() {
    if (vm.hasAnyRole(['chpl-developer']) && authService.getCurrentUser()) {
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
