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

        function editRecipient (id) {
            var editIndex;
            for (var i = 0; i < vm.recipients.length; i++) {
                if (vm.recipients[i].id === id) {
                    editIndex = i;
                    break;
                }
            }
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
                    recipient: function () { return vm.recipients[editIndex]; },
                    reportTypes: function () { return vm.notificationReportTypes; }
                }
            });
            vm.editRecipientInstance.result.then(function (result) {
                if (result.status === 'updated') {
                    vm.recipients[editIndex] = result.recipient;
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
                .then (function (result) {
                    vm.notificationReportTypes = result;
                }, function (error) {
                    $log.warn('error in notification.recipients loadNotificationReportTypes', error);
                });
        }

        function loadRecipients () {
            commonService.getNotificationRecipients()
                .then (function (result) {
                    vm.recipients = result.results;
                }, function (error) {
                    $log.warn('error in notification.recipients loadRecipients', error);
                });
        }
    }
})();
