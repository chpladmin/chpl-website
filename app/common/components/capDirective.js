;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CorrectiveActionPlanController', ['$log', '$scope', '$modal', function ($log, $scope, $modal) {
            var vm = this;

            vm.activate = activate;
            vm.initiateCap = initiateCap;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                if (!vm.correctiveActionPlan) {
                    vm.correctiveActionPlan = [];
                }
            }

            function initiateCap () {
                vm.modalInstance = $modal.open({
                    templateUrl: 'common/components/capModal.html',
                    controller: 'EditCorrectiveActionPlanController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        action: function () { return 'initiate'; },
                        certificationResults: function () { return vm.certificationResults; }
                    }
                });
                vm.modalInstance.result.then(function (result) {
                    $log.info(result);
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
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
                    certificationResults: '=',
                    isEditing: '=',
                    isAdmin: '='
                },
                controllerAs: 'vm',
                controller: 'CorrectiveActionPlanController'
            };
        }]);
})();
