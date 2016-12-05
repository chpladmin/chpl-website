;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AnnouncementEditController', ['$modalInstance', 'authService', 'announcement', 'action', 'commonService', function ($modalInstance, authService, announcement, action, commonService) {
            var vm = this;
            vm.announcement = angular.copy(announcement);
            vm.action = action;

            vm.activate = activate;
            vm.save = save;
            vm.cancel = cancel;
            vm.create = create;
            vm.deleteAnnouncement = deleteAnnouncement;
            vm.datesInvalid = datesInvalid;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
            	vm.isChplAdmin = authService.isChplAdmin();
                vm.announcement.startDate = new Date(announcement.startDate);
                vm.announcement.endDate = new Date(announcement.endDate);
            }

            function datesInvalid () {
                if (vm.announcement.endDate && vm.announcement.startDate) {
                    return (vm.announcement.endDate < vm.announcement.startDate) }
                else {
                    return false;
                }
            }

            function save () {
                commonService.modifyAnnouncement(vm.announcement)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $modalInstance.close(response);
                        } else {
                            $modalInstance.dismiss('An error occurred');
                        }
                    },function (error) {
                        $modalInstance.dismiss(error.data.error);
                    });
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function create () {
                commonService.createAnnouncement(vm.announcement)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $modalInstance.close(response);
                        } else {
                            $modalInstance.dismiss('An error occurred');
                        }
                    },function (error) {
                        $modalInstance.dismiss(error.data.error);
                    });
            }

            function deleteAnnouncement () {
                commonService.deleteAnnouncement(vm.announcement.id)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $modalInstance.close('deleted');
                        } else {
                            $modalInstance.dismiss('An error occurred');
                        }
                    },function (error) {
                        $modalInstance.dismiss(error.data.error);
                    });
            }

        }]);
})();
