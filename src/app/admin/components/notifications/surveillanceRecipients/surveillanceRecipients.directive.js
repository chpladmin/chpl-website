(function () {
    'use strict';

    angular.module('chpl.admin')
        .directive('aiSurveillanceRecipients', aiSurveillanceRecipients)
        .controller('SurveillanceRecipientsController', SurveillanceRecipientsController);

    /** @ngInject */
    function aiSurveillanceRecipients () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/admin/components/notifications/surveillanceRecipients/surveillanceRecipients.html',
            scope: {},
            bindToController: {
                acbs: '='
            },
            controllerAs: 'vm',
            controller: 'SurveillanceRecipientsController'
        };
    }

    /** @ngInject */
    function SurveillanceRecipientsController ($log, commonService) {
        var vm = this;

        vm.loadNotificationReportTypes = loadNotificationReportTypes;
        vm.loadRecipients = loadRecipients;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.loadNotificationReportTypes();
            vm.loadRecipients();
        }

        function loadNotificationReportTypes () {
            commonService.getNotificationReportTypes()
                .then (function (result) {
                    vm.notificationReportTypes = result;
                }, function (error) {
                    vm.notificationReportTypes = [{id: 1, name: 'ONC Surveillance', description: 'something', acb: null}, {id: 2, name: 'ACB Surveillance', description: 'something', acb: {id: 1, name: 'Drummond'}}];
                    $log.warn('error in surveillance.recipients loadNotificationReportTypes', error);
                });
        }

        function loadRecipients () {
            commonService.getSurveillanceRecipients()
                .then (function (result) {
                    vm.surveillanceRecipients = result;
                }, function (error) {
                    vm.surveillanceRecipients = [{id: 1, email: 'sample@example.com', subscriptions: [{id: 1, name: 'ONC Daily', acb: null}]}, {id: 2, email: 'sample2@example.com', subscriptions: [{id: 2, name: 'ACB Weekly', acb: {id: 1, name: 'Drummond'}}]}];
                    $log.warn('error in surveillance.recipients loadRecipients', error);
                });
        }
    }
})();
