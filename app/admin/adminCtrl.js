;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdminController', ['$log', 'authService', function ($log, authService) {
            var vm = this;

            vm.activate = activate;
            vm.changeScreen = changeScreen;
            vm.refresh = refresh;
            vm.triggerRefresh = triggerRefresh;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.handlers = [];
                vm.isAuthed = authService.isAuthed ? authService.isAuthed() : false;
                vm.isChplAdmin = authService.isChplAdmin();
                vm.isAcbAdmin = authService.isAcbAdmin();
                vm.username = authService.getUsername();
                vm.screen = 'dpManagement';
            }

            function changeScreen (screen) {
                vm.screen = screen;
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
