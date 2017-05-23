(function () {
    'use strict';

    angular.module('chpl.admin')
        .directive('aiNotificationRecipients', aiNotificationRecipients)
        .controller('NotificationRecipientsController', NotificationRecipientsController);

    /** @ngInject */
    function aiNotificationRecipients () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/admin/components/notifications/recipients.html',
            scope: {},
            bindToController: {
                acbs: '='
            },
            controllerAs: 'vm',
            controller: 'NotificationRecipientsController'
        };
    }

    /** @ngInject */
    function NotificationRecipientsController ($log, $uibModal, commonService) {
        var vm = this;

        vm.createRecipient = createRecipient;
        vm.editRecipient = editRecipient;
        vm.loadNotificationReportTypes = loadNotificationReportTypes;
        vm.loadRecipients = loadRecipients;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.loadNotificationReportTypes();
            vm.loadRecipients();
        }

        function createRecipient () {
            vm.createRecipientInstance = $uibModal.open({
                templateUrl: 'app/admin/components/notifications/recipient.html',
                controller: 'RecipientController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    acbs: function () { return vm.acbs; },
                    recipient: function () { return {}; },
                    reportTypes: function () { return vm.notificationReportTypes; }
                }
            });
            vm.createRecipientInstance.result.then(function (result) {
                vm.recipients.push(result.recipient);
            }, function (result) {
                if (result !== 'Cancelled') {
                    vm.createMessage = result;
                } else {
                    $log.info('create cancelled');
                }
            });
        }

        function editRecipient (recipient) {
            vm.editRecipientInstance = $uibModal.open({
                templateUrl: 'app/admin/components/notifications/recipient.html',
                controller: 'RecipientController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    acbs: function () { return vm.acbs; },
                    recipient: function () { return recipient; },
                    reportTypes: function () { return vm.notificationReportTypes; }
                }
            });
            vm.editRecipientInstance.result.then(function (result) {
                if (result.status === 'updated') {
                    vm.loadRecipients();
                } else if (result.status === 'deleted') {
                    for (var i = 0; i < vm.recipients.length; i++) {
                        if (recipient.id === vm.recipients[i].id) {
                            vm.recipients.splice(i,1);
                        }
                    }
                }
            }, function (result) {
                if (result !== 'Cancelled') {
                    vm.editMessage = result;
                } else {
                    $log.info('edit cancelled');
                }
            });
        }

        function loadNotificationReportTypes () {
            commonService.getNotificationReportTypes()
                .then(function (result) {
                    vm.notificationReportTypes = result;
                }, function (error) {
                    $log.warn('error in notification.recipients loadNotificationReportTypes', error);
                });
        }

        function loadRecipients () {
            vm.recipients = [];
            commonService.getNotificationRecipients()
                .then(function (result) {
                    vm.recipients = result.results;
                }, function (error) {
                    $log.warn('error in notification.recipients loadRecipients', error);
                });
        }
    }
})();
