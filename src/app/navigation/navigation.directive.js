/* global UAT_MODE */

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
    function NavigationController ($localStorage, $location, $log, $rootScope, $scope, authService, networkService) {
        var vm = this;

        vm.clear = clear;
        vm.getFullname = authService.getFullname;
        vm.isActive = isActive;
        vm.hasAnyRole = authService.hasAnyRole;
        vm.loadAnnouncements = loadAnnouncements;
        vm.loadOrganizations = loadOrganizations;
        vm.showCmsWidget = showCmsWidget;
        vm.showCompareWidget = showCompareWidget;
        vm.toggleNav = toggleNav;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.UAT_MODE = UAT_MODE;
            vm.loadAnnouncements();
            vm.navShown = true;
            $rootScope.bodyClass = 'navigation-shown';

            if (vm.hasAnyRole() && vm.UAT_MODE) {
                vm.loadOrganizations();
                vm.toggleNav();
            }
            var showCmsWidget = $rootScope.$on('ShowWidget', function () {
                vm.showCmsWidget(true);
            });
            $scope.$on('$destroy', showCmsWidget);

            var hideCmsWidget = $rootScope.$on('HideWidget', function () {
                vm.showCmsWidget(false);
            });
            $scope.$on('$destroy', hideCmsWidget);

            var showCompareWidget = $rootScope.$on('ShowCompareWidget', function () {
                vm.showCompareWidget(true);
            });
            $scope.$on('$destroy', showCompareWidget);

            var hideCompareWidget = $rootScope.$on('HideCompareWidget', function () {
                vm.showCompareWidget(false);
            });
            $scope.$on('$destroy', hideCompareWidget);

            var loggedIn = $scope.$on('loggedIn', function () {
                vm.loadAnnouncements();
                vm.loadOrganizations();
                if (vm.navShown && vm.UAT_MODE) {
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
                vm.loadOrganizations();
            })
            $scope.$on('$destroy', impersonating);

            var unimpersonating = $scope.$on('unimpersonating', function () {
                vm.loadAnnouncements();
                vm.loadOrganizations();
            })
            $scope.$on('$destroy', unimpersonating);
        }

        function clear () {
            $rootScope.$broadcast('ClearResults', {});
            $localStorage.clearResults = true;
            $location.url('/search');
        }

        function isActive (route) {
            var paths = $location.path().split('/')
            var routes = route.split('/');
            return (route === $location.path() || (paths[1] === routes[1] && routes.length === 2));
        }

        function loadAnnouncements () {
            networkService.getAnnouncements(false)
                .then(function (result) {
                    vm.announcements = result.announcements;
                });
        }

        function loadOrganizations () {
            if (!vm.UAT_MODE) {
                return;
            }
            networkService.getAcbs(true)
                .then(data => {
                    vm.acbs = data.acbs
                        .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
                        .map(a => {
                            if (a.retired) {
                                a.name += '<span class="pull-right">&lt;retired&gt;</span>';
                            }
                            return a;
                        });
                });
            networkService.getAtls(true)
                .then(data => {
                    vm.atls = data.atls
                        .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
                        .map(a => {
                            if (a.retired) {
                                a.name += '<span class="pull-right">&lt;retired&gt;</span>';
                            }
                            return a;
                        });
                });
        }

        function showCmsWidget (show) {
            vm.widgetExpanded = show;
        }

        function showCompareWidget (show) {
            vm.compareWidgetExpanded = show;
        }

        function toggleNav () {
            vm.navShown = !vm.navShown;
            $rootScope.bodyClass = vm.navShown ? 'navigation-shown' : '';
        }
    }
})();
