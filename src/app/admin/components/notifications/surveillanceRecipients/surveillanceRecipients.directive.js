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

        vm.loadRecipients = loadRecipients;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.loadRecipients();
        }

        function loadRecipients () {
            commonService.getSurveillanceRecipients()
                .then (function (result) {
                    vm.surveillanceRecipients = result;
                }, function (error) {
                    $log.warn('error in surveillance.recipients loadRecipients', error);
                });
        }
    }
})();
