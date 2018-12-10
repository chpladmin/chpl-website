(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AdminController', AdminController);

    /** @ngInclude */
    function AdminController ($filter, $location, $log, $stateParams, authService, networkService) {
        var vm = this;

        vm.changeAcb = changeAcb
        vm.changeAtl = changeAtl
        vm.changeScreen = changeScreen;
        vm.changeSubNav = changeSubNav;
        vm.clearProductId = clearProductId;
        vm.getFullname = getFullname;
        vm.isAcbAdmin = isAcbAdmin;
        vm.isAtlAdmin = isAtlAdmin;
        vm.isAuthed = isAuthed;
        vm.isChplAdmin = isChplAdmin;
        vm.isCmsStaff = isCmsStaff;
        vm.isOncStaff = isOncStaff;
        vm.refresh = refresh;
        vm.triggerRefresh = triggerRefresh;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.handlers = [];
            vm.navState = {
                reports: 'cp-upload',
                notifications: 'surveillance',
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
            if ($stateParams.section) {
                vm.navState.screen = $stateParams.section;
            }
            if (vm.navState.screen === 'reports') {
                if ($stateParams.subSection) {
                    vm.productId = $stateParams.subSection;
                    vm.navState.reports = '';
                }
            } else {
                if ($stateParams.subSection) {
                    vm.navState[vm.navState.screen] = $stateParams.subSection;
                }
                if ($stateParams.productId) {
                    vm.navState.reports = '';
                    vm.productId = $stateParams.productId;
                }
            }

            // load editable acbs & atls
            networkService.getAcbs(true)
                .then(function (data) {
                    vm.acbs = $filter('orderBy')(data.acbs,'name');
                    vm.acb = vm.acbs[0];
                    vm.navState.acbManagement = vm.acb;
                });
            networkService.getAtls(true)
                .then(function (data) {
                    vm.atls = $filter('orderBy')(data.atls,'name');
                    vm.atl = vm.atls[0];
                    vm.navState.atlManagement = vm.atl;
                });
        }

        function changeAcb (acb) {
            vm.acb = acb;
            vm.navState.workType = 'acb';
            vm.changeSubNav(acb);
        }

        function changeAtl (atl) {
            vm.atl = atl;
            vm.navState.workType = 'atl';
            vm.changeSubNav(atl);
        }

        function changeScreen (screen) {
            vm.clearProductId();
            if (screen === 'acbManagement') {
                networkService.getAcbs(true)
                    .then(function (data) {
                        vm.acbs = $filter('orderBy')(data.acbs,'name');
                        vm.acb = vm.acbs[0];
                        vm.navState.acbManagement = vm.acb;
                    });
            }
            if (screen === 'atlManagement') {
                networkService.getAtls(true)
                    .then(function (data) {
                        vm.atls = $filter('orderBy')(data.atls,'name');
                        vm.atl = vm.atls[0];
                        vm.navState.atlManagement = vm.atl;
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
            if ($stateParams.productId) {
                path = path.substring(0,path.lastIndexOf('/'));
                $location.path(path);
            }
            clearSubsection();
        }

        function clearSubsection () {
            var path = $location.path();
            if ($stateParams.productId) {
                path = path.substring(0,path.lastIndexOf('/'));
                $location.path(path);
            }
        }

        function getFullname () {
            return authService.getFullname();
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

        function isOncStaff () {
            return authService.isOncStaff();
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
    }
})();
