;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CorrectiveActionPlanController', ['$log', '$scope', '$modal', function ($log, $scope, $modal) {
            var vm = this;

            ////////////////////////////////////////////////////////////////////

        }])
        .directive('aiCorrectiveActionPlan', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/cap.html',
                scope: {},
                bindToController: {
                    correctiveActionPlan: '=',
                    isEditing: '='
                },
                controllerAs: 'vm',
                controller: 'CorrectiveActionPlanController'
            };
        }]);
})();
