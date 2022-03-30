(function () {
  'use strict';

  angular.module('chpl.navigation')
    .directive('aiNavigationTop', aiNavigationTop)
    .controller('NavigationController', NavigationController);

  /** @ngInject */
  function aiNavigationTop () {
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
  function NavigationController ($localStorage, $location, $log, $rootScope, $scope, $state, authService, featureFlags) {
    var vm = this;

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

    ////////////////////////////////////////////////////////////////////

    this.$onInit = function () {
      $rootScope.bodyClass = 'navigation-shown';

      vm.setDevelopers();

      if (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
        vm.toggleNavClosed();
      } else {
        vm.toggleNavOpen();
      }

      var showCmsWidget = $rootScope.$on('ShowWidget', function () {
        vm.showCmsWidget(true);
        if (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
          vm.toggleNavOpen();
        }
      });
      $scope.$on('$destroy', showCmsWidget);

      var hideCmsWidget = $rootScope.$on('HideWidget', function () {
        vm.showCmsWidget(false);
      });
      $scope.$on('$destroy', hideCmsWidget);

      var showCompareWidget = $rootScope.$on('ShowCompareWidget', function () {
        vm.showCompareWidget(true);
        if (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
          vm.toggleNavOpen();
        }
      });
      $scope.$on('$destroy', showCompareWidget);

      var hideCompareWidget = $rootScope.$on('HideCompareWidget', function () {
        vm.showCompareWidget(false);
      });
      $scope.$on('$destroy', hideCompareWidget);

      var loggedIn = $scope.$on('loggedIn', function () {
        vm.setDevelopers();
        if (vm.navShown) {
          vm.toggleNavClosed();
        }
      });
      $scope.$on('$destroy', loggedIn);

      var loggedOut = $scope.$on('loggedOut', function () {
        vm.setDevelopers();
        if (!vm.navShown) {
          vm.toggleNavOpen();
        }
      });
      $scope.$on('$destroy', loggedOut);

      var impersonating = $scope.$on('impersonating', function () {
        vm.setDevelopers();
      });
      $scope.$on('$destroy', impersonating);

      var unimpersonating = $scope.$on('unimpersonating', function () {
        vm.setDevelopers();
      });
      $scope.$on('$destroy', unimpersonating);

      var flags = $rootScope.$on('flags loaded', function () {
        if (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
          vm.toggleNavClosed();
        }
      });
      $scope.$on('$destroy', flags);

      var logout = $scope.$on('IdleTimeout', function () {
        vm.logout();
      });
      $scope.$on('$destroy', logout);
    };

    function clear () {
      $rootScope.$broadcast('ClearResults', {});
      $localStorage.clearResults = true;
      $location.url('/search');
    }

    function isActive (state) {
      return $state.$current.name.startsWith(state);
    }

    function setDevelopers () {
      if (vm.hasAnyRole(['ROLE_DEVELOPER'])) {
        vm.developers = authService.getCurrentUser().organizations.map((developer) => developer);
      } else {
        vm.developers = [];
      }
    }

    function showCmsWidget (show) {
      vm.widgetExpanded = show;
    }

    function showCompareWidget (show) {
      vm.compareWidgetExpanded = show;
    }

    function toggleNavClosed () {
      vm.navShown = false;
      $rootScope.bodyClass = 'navigation-hidden';
    }

    function toggleNavOpen () {
      vm.navShown = true;
      $rootScope.bodyClass = 'navigation-shown';
    }
  }
})();
