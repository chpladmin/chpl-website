;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CorrectiveActionPlanController', ['$log', '$scope', '$modal', function ($log, $scope, $modal) {
            var vm = this;

            vm.activate = activate;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                if (!vm.correctiveActionPlan) {
                    vm.correctiveActionPlan = [];
                }
            }
        }])
        .directive('aiCorrectiveActionPlan', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/cap.html',
                scope: {},
                bindToController: {
                    correctiveActionPlan: '=',
                    isEditing: '=',
                    isAdmin: '='
                },
                controllerAs: 'vm',
                controller: 'CorrectiveActionPlanController'
            };
        }]);
})();
