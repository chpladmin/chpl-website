;(function () {
    'use strict';

    angular.module('app.nav')
        .controller('NavigationController', ['authService', '$location', '$log', '$scope', function (authService, $location, $log, $scope) {
            var vm = this;

            vm.getUsername = getUsername;
            vm.isAcbAdmin = isAcbAdmin;
            vm.isAcbStaff = isAcbStaff;
            vm.isActive = isActive;
            vm.isAtlAdmin = isAtlAdmin;
            vm.isAuthed = isAuthed;
            vm.isChplAdmin = isChplAdmin;

//            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                $scope.$on('admin.login', function (event, arg) {
                    $log.debug('event', event, 'arg', arg);
                });
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
                return route === $location.path();
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
        }]);
})();
