;(function () {
    'use strict';

    angular.module('app.common')
        .controller('SurveillanceController', ['$log', '$scope', '$modal', 'commonService', 'authService', 'API', function ($log, $scope, $modal, commonService, authService, API) {
            var vm = this;

            vm.editSurveillance = editSurveillance;
            vm.initiateSurveillance = initiateSurveillance;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.API = API;
                vm.API_KEY = authService.getApiKey();
                vm.surveillanceTypes = commonService.getSurveillanceLookups();
            }

            function editSurveillance (surveillance) {
                vm.modalInstance = $modal.open({
                    templateUrl: 'admin/components/surveillance/editSurveillance.html',
                    controller: 'EditSurveillanceController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        surveillance: function () { return surveillance; },
                        surveillanceTypes: function () { return vm.surveillanceTypes; },
                        workType: function () { return 'edit'; }
                    }
                });
                vm.modalInstance.result.then(function (result) {
                    commonService.getSurveillance(vm.certifiedProduct.id)
                        .then(function (result) {
                            vm.surveillances = result;
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
            }

            function initiateSurveillance () {
                vm.modalInstance = $modal.open({
                    templateUrl: 'admin/components/surveillance/editSurveillance.html',
                    controller: 'EditSurveillanceController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        surveillance: function () { return { certifiedProduct: vm.certifiedProduct }; },
                        surveillanceTypes: function () { return vm.surveillanceTypes; },
                        workType: function () { return 'initiate'; }
                    }
                });
                vm.modalInstance.result.then(function (result) {
                    commonService.getSurveillance(vm.certifiedProduct.id)
                        .then(function (result) {
                            vm.surveillances = result;
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
                templateUrl: 'common/components/surveillance/surveillance.html',
                scope: {},
                bindToController: {
                    allowEditing: '=',
                    certifiedProduct: '=',
                    surveillances: '='
                },
                size: 'lg',
                controllerAs: 'vm',
                controller: 'SurveillanceController'
            };
        }]);
})();
