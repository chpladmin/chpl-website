(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AnnouncementsController', AnnouncementsController)
        .directive('aiAnnouncementsManagement', aiAnnouncementsManagement);

    /** @ngInject */
    function aiAnnouncementsManagement () {
        return {
            controller: 'AnnouncementsController',
            controllerAs: 'vm',
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'app/admin/components/announcements/view.html',
        };
    }

    /** @ngInject */
    function AnnouncementsController ($log, $uibModal, networkService) {
        var vm = this;

        vm.create = create;
        vm.edit = edit;
        vm.loadAnnouncements = loadAnnouncements;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.loadAnnouncements();
        }

        function create () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/announcements/edit.html',
                controller: 'AnnouncementEditController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    announcement: function () {return {}; },
                    action: function () { return 'create'; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                if (!vm.announcements) {
                    vm.announcements = [];
                }
                vm.announcements.push(result);
                vm.errorMessage = '';
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info('dismissed', result);
                    vm.errorMessage = result;
                }
            });
        }

        function edit (a, index) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/announcements/edit.html',
                controller: 'AnnouncementEditController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    announcement: function () { return a; },
                    action: function () { return 'edit'; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                if (result === 'deleted') {
                    vm.announcements.splice(index, 1);
                } else {
                    vm.announcements[index] = result;
                }
                vm.errorMessage = '';
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info('dismissed', result);
                    vm.errorMessage = result;
                }
            });
        }

        function loadAnnouncements () {
            networkService.getAnnouncements(true)
                .then(function (result) {
                    vm.announcements = result.announcements;
                }, function (error) {
                    $log.info('error in app.admin.announcement.controller.loadAnnouncements', error);
                });
        }
    }
})();
