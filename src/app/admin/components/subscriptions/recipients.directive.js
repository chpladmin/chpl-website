(function () {
    'use strict';

    angular.module('chpl.admin')
        .directive('aiSubscriptionRecipients', aiSubscriptionRecipients)
        .controller('SubscriptionRecipientsController', SubscriptionRecipientsController);

    /** @ngInject */
    function aiSubscriptionRecipients () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/admin/components/subscriptions/recipients.html',
            scope: {},
            bindToController: {
                acbs: '=',
            },
            controllerAs: 'vm',
            controller: 'SubscriptionRecipientsController',
        };
    }

    /** @ngInject */
    function SubscriptionRecipientsController ($log, $uibModal, commonService) {
        var vm = this;

        vm.createRecipient = createRecipient;
        vm.editRecipient = editRecipient;
        vm.loadSubscriptionReportTypes = loadSubscriptionReportTypes;
        vm.loadRecipients = loadRecipients;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.loadSubscriptionReportTypes();
            vm.loadRecipients();
        }

        function createRecipient () {
            vm.createRecipientInstance = $uibModal.open({
                templateUrl: 'app/admin/components/subscriptions/recipient.html',
                controller: 'RecipientController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    acbs: function () { return vm.acbs; },
                    recipient: function () { return {}; },
                    reportTypes: function () { return vm.subscriptionReportTypes; },
                },
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
                templateUrl: 'app/admin/components/subscriptions/recipient.html',
                controller: 'RecipientController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    acbs: function () { return vm.acbs; },
                    recipient: function () { return recipient; },
                    reportTypes: function () { return vm.subscriptionReportTypes; },
                },
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
                } else {
                    $log.info('unknown edit close', result);
                }
            }, function (result) {
                if (result !== 'Cancelled') {
                    vm.editMessage = result;
                } else {
                    $log.info('edit cancelled');
                }
            });
        }

        function loadSubscriptionReportTypes () {
            commonService.getSubscriptionReportTypes()
                .then(function (result) {
                    vm.subscriptionReportTypes = result;
                }, function (error) {
                    $log.warn('error in subscription.recipients loadSubscriptionReportTypes', error);
                });
        }

        function loadRecipients () {
            vm.recipients = [];
            commonService.getSubscriptionRecipients()
                .then(function (result) {
                    vm.recipients = result.results;
                }, function (error) {
                    $log.warn('error in subscription.recipients loadRecipients', error);
                });
        }
    }
})();
