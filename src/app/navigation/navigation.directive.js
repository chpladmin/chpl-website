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
            templateUrl: 'app/navigation/navigation-top.html',
            bindToController: { },
            scope: {},
            controllerAs: 'vm',
            controller: 'NavigationController'
        }
    }

    /** @ngInject */
    function aiNavigationBottom () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/navigation/navigation-bottom.html',
            bindToController: { },
            scope: {},
            controllerAs: 'vm',
            controller: 'NavigationController'
        }
    }

    /** @ngInject */
    function NavigationController (authService, commonService, $location, $log, $scope, $rootScope, $localStorage) {
        var vm = this;

        vm.clear = clear;
        vm.getUsername = getUsername;
        vm.isAcbAdmin = isAcbAdmin;
        vm.isAcbStaff = isAcbStaff;
        vm.isActive = isActive;
        vm.isAtlAdmin = isAtlAdmin;
        vm.isAuthed = isAuthed;
        vm.isChplAdmin = isChplAdmin;
        vm.isCmsStaff = isCmsStaff;
        vm.isOncStaff = isOncStaff;
        vm.loadAnnouncements = loadAnnouncements;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.loadAnnouncements();
        }

        function clear () {
            $rootScope.$broadcast('ClearResults', {});
            $localStorage.clearResults = true;
        }

        function getUsername () {
            return authService.getUsername();
        }

        function isAcbAdmin () {
            return authService.isAcbAdmin();
        }

        function isAcbStaff () {
            return authService.isAcbStaff();
        }

        function isActive (route) {
            var paths = $location.path().split('/')
            var routes = route.split('/');
            return (route === $location.path() || (paths[1] === routes[1] && routes.length === 2));
        }

        function isAtlAdmin () {
            return authService.isAtlAdmin();
        }

        function isAuthed () {
            return authService.isAuthed()
        }

        function isChplAdmin () {
            return authService.isChplAdmin();
        }

        function isCmsStaff () {
            return authService.isCmsStaff();
        }

        function isOncStaff () {
            return authService.isOncStaff();
        }

        function loadAnnouncements () {
            commonService.getAnnouncements(false)
                .then (function (result) {
                    vm.announcements = result.announcements;
                }, function (error) {
                    $log.debug('error in chpl.overview.controller.loadAnnouncements', error);
                });
        }
    }
})();
