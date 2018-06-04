(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('RecipientController', RecipientController);

    /** @ngInject */
    function RecipientController ($log, $uibModalInstance, acbs, networkService, recipient, reportTypes) {
        var vm = this;

        vm.addSubscription = addSubscription;
        vm.attachReports = attachReports;
        vm.cancel = cancel;
        vm.deleteRecipient = deleteRecipient;
        vm.removeSubscription = removeSubscription;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.acbs = acbs.filter(function (acb) { return !acb.isDeleted; });
            vm.recipient = angular.copy(recipient);
            vm.reportTypes = angular.copy(reportTypes);

            vm.attachReports();
        }

        function addSubscription () {
            vm.recipient.subscriptions.push({});
        }

        function attachReports () {
            if (vm.recipient.subscriptions) {
                var i, j;
                for (i = 0; i < vm.recipient.subscriptions.length; i++) {
                    for (j = 0; j < vm.reportTypes.length; j++) {
                        if (vm.recipient.subscriptions[i].notificationType.id === vm.reportTypes[j].id) {
                            vm.recipient.subscriptions[i].notificationType = vm.reportTypes[j];
                        }
                    }
                    if (vm.recipient.subscriptions[i].acb) {
                        for (j = 0; j < vm.acbs.length; j++) {
                            if (vm.recipient.subscriptions[i].acb.id === vm.acbs[j].id) {
                                vm.recipient.subscriptions[i].acb = vm.acbs[j];
                            }
                        }
                    }
                }
            } else {
                vm.recipient.subscriptions = [{}];
            }
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function deleteRecipient () {
            networkService.deleteRecipient(vm.recipient)
                .then(function (response) {
                    if (response.status === 200) {
                        $uibModalInstance.close({
                            status: 'deleted',
                        });
                    } else {
                        vm.errorMessage = response.data.error;
                    }
                },function (error) {
                    vm.errorMessage = error.data.error;
                });
        }

        function removeSubscription (idx) {
            vm.recipient.subscriptions.splice(idx,1);
        }

        function save () {
            if (vm.recipient.id) {
                networkService.updateRecipient(vm.recipient)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close({
                                recipient: response,
                                status: 'updated',
                            });
                        } else {
                            vm.errorMessage = response.data.error;
                        }
                    },function (error) {
                        vm.errorMessage = error.data.error;
                    });
            } else {
                networkService.createRecipient(vm.recipient)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close({
                                recipient: response,
                            });
                        } else {
                            vm.errorMessage = response.data.error;
                        }
                    },function (error) {
                        vm.errorMessage = error.data.error;
                    });
            }
        }
    }
})();
