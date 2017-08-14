(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AnnouncementEditController', AnnouncementEditController);

    /** @ngInject */
    function AnnouncementEditController ($uibModalInstance, action, announcement, authService, commonService) {
        var vm = this;

        vm.cancel = cancel;
        vm.create = create;
        vm.datesInvalid = datesInvalid;
        vm.deleteAnnouncement = deleteAnnouncement;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.announcement = angular.copy(announcement);
            vm.action = action;
            vm.isChplAdmin = authService.isChplAdmin();
            vm.announcement.startDate = new Date(announcement.startDate);
            vm.announcement.endDate = new Date(announcement.endDate);
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function create () {
            commonService.createAnnouncement(vm.announcement)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close(response);
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $uibModalInstance.dismiss(error.data.error);
                });
        }

        function datesInvalid () {
            if (vm.announcement.endDate && vm.announcement.startDate) {
                return (vm.announcement.endDate < vm.announcement.startDate) }
            else {
                return false;
            }
        }

        function deleteAnnouncement () {
            commonService.deleteAnnouncement(vm.announcement.id)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close('deleted');
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $uibModalInstance.dismiss(error.data.error);
                });
        }

        function save () {
            commonService.modifyAnnouncement(vm.announcement)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close(response);
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $uibModalInstance.dismiss(error.data.error);
                });
        }
    }
})();
