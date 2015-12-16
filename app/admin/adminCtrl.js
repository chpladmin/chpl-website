;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdminController', ['$log', '$filter', 'authService', 'commonService', function ($log, $filter, authService, commonService) {
            var vm = this;

            vm.changeAcb = changeAcb
            vm.changeAtl = changeAtl
            vm.changeScreen = changeScreen;
            vm.changeSubNav = changeSubNav;
            vm.getUsername = getUsername;
            vm.isAcbAdmin = isAcbAdmin;
            vm.isAtlAdmin = isAtlAdmin;
            vm.isAuthed = isAuthed;
            vm.isChplAdmin = isChplAdmin;
            vm.refresh = refresh;
            vm.triggerRefresh = triggerRefresh;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.handlers = [];
                vm.navState = {
                    screen: 'dpManagement',
                    reports: 'cp'
                };
                if (!vm.isChplAdmin()) {
                    vm.navState.dpManagement = 'upload';
                } else {
                    vm.navState.dpManagement = 'manage';
                }
                commonService.getAcbs()
                    .then (function (data) {
                        vm.acbs = $filter('orderBy')(data.acbs,'name');
                        vm.activeAcb = vm.acbs[0];
                        vm.navState.acbManagement = vm.activeAcb;
                    });
                commonService.getAtls()
                    .then (function (data) {
                        vm.atls = $filter('orderBy')(data.atls,'name');
                        vm.activeAtl = vm.atls[0];
                        vm.navState.atlManagement = vm.activeAtl;
                    });
            }

            function changeAcb (acb) {
                vm.activeAcb = acb;
                vm.navState.workType = 'acb';
                vm.changeSubNav(acb);
            }

            function changeAtl (atl) {
                vm.activeAtl = atl;
                vm.navState.workType = 'atl';
                vm.changeSubNav(atl);
            }

            function changeScreen (screen) {
                if (screen === 'acbManagement') {
                commonService.getAcbs()
                    .then (function (data) {
                        vm.acbs = $filter('orderBy')(data.acbs,'name');
                        vm.activeAcb = vm.acbs[0];
                        vm.navState.acbManagement = vm.activeAcb;
                    });
                }
                if (screen === 'atlManagement') {
                commonService.getAtls()
                    .then (function (data) {
                        vm.atls = $filter('orderBy')(data.atls,'name');
                        vm.activeAtl = vm.atls[0];
                        vm.navState.atlManagement = vm.activeAtl;
                    });
                }
                vm.navState.screen = screen;
            }

            function changeSubNav (subScreen) {
                vm.navState[vm.navState.screen] = subScreen;
            }

            function getUsername () {
                return authService.getUsername();
            }

            function isAcbAdmin () {
                return authService.isAcbAdmin();
            }

            function isAtlAdmin () {
                return authService.isAtlAdmin();
            }

            function isAuthed () {
                return authService.isAuthed();
            }

            function isChplAdmin () {
                return authService.isChplAdmin();
            }

            function refresh () {
                angular.forEach(vm.handlers, function (handler) {
                    handler();
                });
            }

            function triggerRefresh (handler) {
                vm.handlers.push(handler);
                var removeHandler = function () {
                    vm.handlers = vm.handlers.filter(function (aHandler) {
                        return aHandler !== handler;
                    });
                };
                return removeHandler;
            }
        }]);
})();
