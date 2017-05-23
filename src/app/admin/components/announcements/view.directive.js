(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AnnouncementsController', AnnouncementsController)
        .directive('aiAnnouncementsManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'app/admin/components/announcements/view.html',
                scope: {},
                bindToController: {
                    admin: '='
                },
                controllerAs: 'vm',
                controller: 'AnnouncementsController'
            };
        });

    /** @ngInject */
    function AnnouncementsController ($log, commonService, authService, $uibModal) {
        var vm = this;

        vm.loadAnnouncements = loadAnnouncements;
        vm.create = create;
        vm.edit = edit;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.loadAnnouncements();
            vm.isChplAdmin = authService.isChplAdmin();
            vm.errorMessage = '';
        }

        function loadAnnouncements () {
            commonService.getAnnouncements(true)
                .then(function (result) {
                    vm.announcements = result.announcements;
                }, function (error) {
                    $log.debug('error in app.admin.announcement.controller.loadAnnouncements', error);
                });
        }

        function create () {
            vm.editModalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/announcements/edit.html',
                controller: 'AnnouncementEditController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    announcement: function () {return {}; },
                    action: function () { return 'create'; },
                    authService: function () { return authService; }
                }
            });
            vm.editModalInstance.result.then(function (result) {
                if (!vm.announcement) {
                    vm.announcement = [];
                }
                vm.announcements.push(result);
                vm.errorMessage = '';
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug('dismissed', result);
                    vm.errorMessage = result;
                }
            });
        }

        function edit (a, index) {
            vm.editModalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/announcements/edit.html',
                controller: 'AnnouncementEditController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    announcement: function () { return a; },
                    action: function () { return 'edit'; },
                    authService: function () { return authService; }
                }
            });
            vm.editModalInstance.result.then(function (result) {
                if (result === 'deleted') {
                    vm.loadAnnouncements();
                } else {
                    vm.announcements[index] = result;
                }
                vm.errorMessage = '';
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug('dismissed', result);
                    vm.errorMessage = result;
                }
            });
        }
    }
})();
