;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CorrectiveActionPlanController', ['$log', '$scope', '$modal', 'commonService', 'authService', 'API', function ($log, $scope, $modal, commonService, authService, API) {
            var vm = this;

            vm.activate = activate;
            vm.editCap = editCap;
            vm.initiateCap = initiateCap;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.API = API;
                vm.API_KEY = authService.getApiKey();
                if (vm.correctiveActionPlan) {
                    for (var i = 0; i < vm.correctiveActionPlan.length; i++) {
                        if (vm.correctiveActionPlan[i].acbSummary)
                            vm.correctiveActionPlan[i].type = 'General, ';
                        else
                            vm.correctiveActionPlan[i].type = '';
                        if (vm.correctiveActionPlan[i].certifications && vm.correctiveActionPlan[i].certifications.length > 0) {
                            for (var j = 0; j < vm.correctiveActionPlan[i].certifications.length; j++) {
                                vm.correctiveActionPlan[i].type += vm.correctiveActionPlan[i].certifications[j].certificationCriterionNumber + ', ';
                            }
                        }
                    vm.correctiveActionPlan[i].type = vm.correctiveActionPlan[i].type.substring(0, vm.correctiveActionPlan[i].type.length - 2);
                    }
                }
            }

            function editCap (cap) {
                vm.modalInstance = $modal.open({
                    templateUrl: 'common/components/capModal.html',
                    controller: 'EditCorrectiveActionPlanController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        action: function () { return 'edit'; },
                        certifiedProductId: function () { return vm.certifiedProductId; },
                        certificationResults: function () { return vm.certificationResults; },
                        correctiveActionPlan: function () { return cap; }
                    }
                });
                vm.modalInstance.result.then(function (result) {
                    commonService.getCap(vm.certifiedProductId)
                        .then(function (result) {
                            vm.correctiveActionPlan = result.plans;
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
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
                        certifiedProductId: function () { return vm.certifiedProductId; },
                        certificationResults: function () { return vm.certificationResults; },
                        correctiveActionPlan: function () { return {}; }
                    }
                });
                vm.modalInstance.result.then(function (result) {
                    commonService.getCap(vm.certifiedProductId)
                        .then(function (result) {
                            vm.correctiveActionPlan = result.plans;
                        });
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
                    certifiedProductId: '=',
                    certificationResults: '=',
                    isAdmin: '='
                },
                size: 'lg',
                controllerAs: 'vm',
                controller: 'CorrectiveActionPlanController'
            };
        }]);
})();
