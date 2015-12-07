;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdminController', ['$log', '$filter', 'authService', 'commonService', function ($log, $filter, authService, commonService) {
            var vm = this;

            vm.changeAcb = changeAcb
            vm.changeScreen = changeScreen;
            vm.changeSubNav = changeSubNav;
            vm.refresh = refresh;
            vm.triggerRefresh = triggerRefresh;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.handlers = [];
                vm.isAuthed = authService.isAuthed ? authService.isAuthed() : false;
                vm.isChplAdmin = authService.isChplAdmin();
                vm.isAcbAdmin = authService.isAcbAdmin();
                vm.username = authService.getUsername();
                vm.navState = {
                    screen: 'dpManagement',
                    reports: 'cp'
                };
                if (!vm.isChplAdmin) {
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
            }

            function changeAcb (acb) {
                vm.activeAcb = acb;
                vm.navState.workType = 'acb';
                vm.changeSubNav(acb);
            }

            function changeScreen (screen) {
                vm.navState.screen = screen;
            }

            function changeSubNav (subScreen) {
                vm.navState[vm.navState.screen] = subScreen;
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
