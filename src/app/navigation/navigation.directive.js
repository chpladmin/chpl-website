(function () {
    'use strict';

    angular.module('chpl.navigation')
        .directive('aiNavigationTop', aiNavigationTop)
        .directive('aiNavigationBottom', aiNavigationBottom)
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
        }
    }

    /** @ngInject */
    function aiNavigationBottom () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'chpl.navigation/navigation-bottom.html',
            bindToController: { },
            scope: { },
            controllerAs: 'vm',
            controller: 'NavigationController',
        }
    }

    /** @ngInject */
    function NavigationController ($localStorage, $location, $log, $rootScope, $scope, $state, authService, featureFlags, networkService) {
        var vm = this;

        vm.clear = clear;
        vm.getFullname = authService.getFullname;
        vm.isActive = isActive;
        vm.isOn = featureFlags.isOn;
        vm.hasAnyRole = authService.hasAnyRole;
        vm.loadAnnouncements = loadAnnouncements;
        vm.showCmsWidget = showCmsWidget;
        vm.showCompareWidget = showCompareWidget;
        vm.toggleNav = toggleNav;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.loadAnnouncements();
            vm.navShown = true;
            $rootScope.bodyClass = 'navigation-shown';

            if (vm.hasAnyRole() && featureFlags.isOn('adminNav')) {
                vm.toggleNav();
            }
            var showCmsWidget = $rootScope.$on('ShowWidget', function () {
                vm.showCmsWidget(true);
                if (vm.hasAnyRole() && featureFlags.isOn('adminNav')) {
                    vm.toggleNav(true);
                }
            });
            $scope.$on('$destroy', showCmsWidget);

            var hideCmsWidget = $rootScope.$on('HideWidget', function () {
                vm.showCmsWidget(false);
            });
            $scope.$on('$destroy', hideCmsWidget);

            var showCompareWidget = $rootScope.$on('ShowCompareWidget', function () {
                vm.showCompareWidget(true);
                if (vm.hasAnyRole() && featureFlags.isOn('adminNav')) {
                    vm.toggleNav(true);
                }
            });
            $scope.$on('$destroy', showCompareWidget);

            var hideCompareWidget = $rootScope.$on('HideCompareWidget', function () {
                vm.showCompareWidget(false);
            });
            $scope.$on('$destroy', hideCompareWidget);

            var loggedIn = $scope.$on('loggedIn', function () {
                vm.loadAnnouncements();
                if (vm.navShown && featureFlags.isOn('adminNav')) {
                    vm.toggleNav();
                }
            })
            $scope.$on('$destroy', loggedIn);

            var loggedOut = $scope.$on('loggedOut', function () {
                vm.loadAnnouncements();
                if (!vm.navShown) {
                    vm.toggleNav();
                }
            })
            $scope.$on('$destroy', loggedOut);

            var impersonating = $scope.$on('impersonating', function () {
                vm.loadAnnouncements();
            })
            $scope.$on('$destroy', impersonating);

            var unimpersonating = $scope.$on('unimpersonating', function () {
                vm.loadAnnouncements();
            })
            $scope.$on('$destroy', unimpersonating);

            var flags = $rootScope.$on('flags loaded', function () {
                if (vm.hasAnyRole() && featureFlags.isOn('adminNav')) {
                    vm.toggleNav();
                }
            });
            $scope.$on('$destroy', flags);
        }

        function clear () {
            $rootScope.$broadcast('ClearResults', {});
            $localStorage.clearResults = true;
            $location.url('/search');
        }

        function isActive (state) {
            return $state.$current.name.startsWith(state);
        }

        function loadAnnouncements () {
            networkService.getAnnouncements(false)
                .then(function (result) {
                    vm.announcements = result.announcements;
                });
        }

        function showCmsWidget (show) {
            vm.widgetExpanded = show;
        }

        function showCompareWidget (show) {
            vm.compareWidgetExpanded = show;
        }

        function toggleNav (forceOpen) {
            if (forceOpen) {
                vm.navShown = true;
                $rootScope.bodyClass = 'navigation-shown';
            } else {
                vm.navShown = !vm.navShown;
                $rootScope.bodyClass = vm.navShown ? 'navigation-shown' : 'navigation-hidden';
            }
        }
    }
})();
