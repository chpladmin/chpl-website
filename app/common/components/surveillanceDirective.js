;(function () {
    'use strict';

    angular.module('app.common')
        .controller('SurveillanceController', ['$log', '$scope', '$modal', 'commonService', function ($log, $scope, $modal, commonService) {
            var vm = this;

            vm.activate = activate;
            vm.editSurveillance = editSurveillance;
            vm.initiateSurveillance = initiateSurveillance;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                if (!vm.surveillance) {
                    vm.surveillance = [];
                }
            }

            function editSurveillance (surveillance) {
                vm.modalInstance = $modal.open({
                    templateUrl: 'common/components/surveillanceModal.html',
                    controller: 'EditSurveillanceController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        action: function () { return 'edit'; },
                        certifiedProductId: function () { return vm.certifiedProductId; },
                        certificationResults: function () { return vm.certificationResults; },
                        surveillance: function () { return vm.surveillance; }
                    }
                });
                vm.modalInstance.result.then(function (result) {
                    commonService.getSurveillance(vm.certifiedProductId)
                        .then(function (result) {
                            vm.surveillance = result.surveillance;
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
            }

            function initiateSurveillance () {
                vm.modalInstance = $modal.open({
                    templateUrl: 'common/components/surveillanceModal.html',
                    controller: 'EditSurveillanceController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        action: function () { return 'initiate'; },
                        certifiedProductId: function () { return vm.certifiedProductId; },
                        certificationResults: function () { return vm.certificationResults; },
                        surveillance: function () { return {}; }
                    }
                });
                vm.modalInstance.result.then(function (result) {
                    commonService.getSurveillance(vm.certifiedProductId)
                        .then(function (result) {
                            vm.surveillance = result.surveillance;
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
            }
        }])
        .directive('aiSurveillance', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/surveillance.html',
                scope: {},
                bindToController: {
                    surveillance: '=',
                    certifiedProductId: '=',
                    certificationResults: '=',
                    isAdmin: '='
                },
                size: 'lg',
                controllerAs: 'vm',
                controller: 'SurveillanceController'
            };
        }]);
})();
