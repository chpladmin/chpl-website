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
        vm.getUsername = authService.getUsername;
        vm.isAcbAdmin = authService.isAcbAdmin;
        vm.isActive = isActive;
        vm.isAtlAdmin = authService.isAtlAdmin;
        vm.isAuthed = authService.isAuthed;
        vm.isChplAdmin = authService.isChplAdmin;
        vm.isCmsStaff = authService.isCmsStaff;
        vm.isOncStaff = authService.isOncStaff;
        vm.loadAnnouncements = loadAnnouncements;
        vm.showCmsWidget = showCmsWidget;
        vm.showCompareWidget = showCompareWidget;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.loadAnnouncements();

            var cmsWidget = $rootScope.$on('ShowWidget', function () {
                vm.showCmsWidget();
            });
            $scope.$on('$destroy', cmsWidget);

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
            })
            $scope.$on('$destroy', loggedIn);
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

        function showCmsWidget () {
            vm.widgetExpanded = true;
        }

        function showCompareWidget (show) {
            vm.compareWidgetExpanded = show;
        }
    }
})();
