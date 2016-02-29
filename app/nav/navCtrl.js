;(function () {
    'use strict';

    angular.module('app.nav')
        .controller('NavigationController', ['authService', 'commonService', '$location', '$log', '$scope', function (authService, commonService, $location, $log, $scope) {
            var vm = this;

            vm.getUsername = getUsername;
            vm.isAcbAdmin = isAcbAdmin;
            vm.isAcbStaff = isAcbStaff;
            vm.isActive = isActive;
            vm.isAtlAdmin = isAtlAdmin;
            vm.isAuthed = isAuthed;
            vm.isChplAdmin = isChplAdmin;
            vm.loadAnnouncements = loadAnnouncements;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.loadAnnouncements();
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

            function loadAnnouncements () {
            	commonService.getAnnouncements(false)
            		.then (function (result) {
            			vm.announcements = result.announcements;
            		}, function (error) {
            			$log.debug('error in app.overview.controller.loadAnnouncements', error);
            		});
            }
        }]);
})();
