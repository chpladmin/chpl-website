;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdminController', ['$log', '$filter', '$routeParams', '$location', 'authService', 'commonService', function ($log, $filter, $routeParams, $location, authService, commonService) {
            var vm = this;

            vm.changeAcb = changeAcb
            vm.changeAtl = changeAtl
            vm.changeScreen = changeScreen;
            vm.changeSubNav = changeSubNav;
            vm.clearProductId = clearProductId;
            vm.getUsername = getUsername;
            vm.isAcbAdmin = isAcbAdmin;
            vm.isAtlAdmin = isAtlAdmin;
            vm.isAuthed = isAuthed;
            vm.isChplAdmin = isChplAdmin;
            vm.isCmsStaff = isCmsStaff;
            vm.refresh = refresh;
            vm.triggerRefresh = triggerRefresh;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.handlers = [];
                vm.navState = {
                    reports: 'cp'
                };

                // base case
                if (vm.isChplAdmin() || vm.isAcbAdmin()) {
                    vm.navState.screen = 'dpManagement';
                } else if (vm.isAtlAdmin()) {
                    vm.navState.screen = 'atlManagement';
                }
                if (!vm.isChplAdmin()) {
                    vm.navState.dpManagement = 'upload';
                } else {
                    vm.navState.dpManagement = 'manage';
                }

                // chosen section
                if ($routeParams.section) {
                    vm.navState.screen = $routeParams.section;
                }
                if ($routeParams.productId)  {
                    vm.navState.reports = '';
                    vm.navState.dpManagement = 'manage';
                    vm.productId = $routeParams.productId;
                }

                // load editable acbs & atls
                commonService.getAcbs(true, vm.isChplAdmin())
                    .then (function (data) {
                        vm.acbs = $filter('orderBy')(data.acbs,'name');
                        vm.activeAcb = vm.acbs[0];
                        vm.navState.acbManagement = vm.activeAcb;
                    });
                commonService.getAtls(true, vm.isChplAdmin())
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
                vm.clearProductId();
                if (screen === 'acbManagement') {
                    commonService.getAcbs(true, vm.isChplAdmin())
                        .then (function (data) {
                            vm.acbs = $filter('orderBy')(data.acbs,'name');
                            vm.activeAcb = vm.acbs[0];
                            vm.navState.acbManagement = vm.activeAcb;
                        });
                }
                if (screen === 'atlManagement') {
                    commonService.getAtls(true, vm.isChplAdmin())
                        .then (function (data) {
                            vm.atls = $filter('orderBy')(data.atls,'name');
                            vm.activeAtl = vm.atls[0];
                            vm.navState.atlManagement = vm.activeAtl;
                        });
                }
                vm.navState.screen = screen;
            }

            function changeSubNav (subScreen) {
                vm.clearProductId();
                vm.navState[vm.navState.screen] = subScreen;
            }

            function clearProductId () {
                var path = $location.path();
                if ($routeParams.productId)  {
                    path = path.substring(0,path.lastIndexOf('/'));
                    $location.path(path);
                }
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

            function isCmsStaff () {
                return authService.isCmsStaff();
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
