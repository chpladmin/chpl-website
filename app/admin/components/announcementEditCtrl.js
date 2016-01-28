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

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
            	vm.isChplAdmin = authService.isChplAdmin();
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
