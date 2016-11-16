;(function () {
    'use strict';

    angular.module('app.common')
        .controller('SurveillanceController', ['$log', '$scope', '$modal', '$filter', 'commonService', 'authService', 'API', function ($log, $scope, $modal, $filter, commonService, authService, API) {
            var vm = this;

            vm.editSurveillance = editSurveillance;
            vm.getTitle = getTitle;
            vm.initiateSurveillance = initiateSurveillance;
            vm.surveillanceResults = surveillanceResults;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.API = API;
                vm.API_KEY = authService.getApiKey();
                vm.surveillanceTypes = commonService.getSurveillanceLookups();
            }

            function editSurveillance (surveillance) {
                fixRequirementOptions();
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
                    commonService.getProduct(vm.certifiedProduct.id)
                        .then(function (result) {
                            vm.certifiedProduct = result;
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
            }

            function getTitle (surv) {
                var closed = surv.endDate ? true : false;
                var title = closed ?
                    'Closed Surveillance, Ended ' + $filter('date')(surv.endDate, 'mediumDate', 'UTC') + ': ' :
                    'Open Surveillance, Began ' + $filter('date')(surv.startDate, 'mediumDate', 'UTC') + ': ';
                var nonconformityCount = 0;
                for (var i = 0; i < surv.requirements.length[i]; i++) {
                    for (var j = 0; j < surv.requirements[i].nonconformities.length; j++) {
                        if (surv.requirements[i].nonconformities[j].status.name === 'Open') {
                            nonconformityCount += 1;
                        }
                    }
                }
                title += nonconformityCount;
                if (nonconformityCount !== 1) {
                    title += ' Non-Conformities Found';
                } else {
                    title += ' Non-Conformity Found';
                }
                return title;
            }

            function initiateSurveillance () {
                fixRequirementOptions();
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
                    commonService.getProduct(vm.certifiedProduct.id)
                        .then(function (result) {
                            vm.certifiedProduct = result;
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
            }

            function surveillanceResults (surv) {
                var results = [];
                for (var i = 0; i < surv.requirements.length[i]; i++) {
                    for (var j = 0; j < surv.requirements[i].nonconformities.length; j++) {
                        results.push(surv.requirements[i].nonconformities[j].status.name + ' Non-Conformity Found for ' + surv.requirements[i].requirement);
                    }
                }
                if (results.length === 0) {
                    results.push('No Non-Conformities Found');
                }
                return results;
            }

            ////////////////////////////////////////////////////////////////////

            function fixRequirementOptions () {
                if (vm.certifiedProduct.certificationEdition.name === '2015') {
                    vm.surveillanceTypes.surveillanceRequirements.criteriaOptions = vm.surveillanceTypes.surveillanceRequirements.criteriaOptions2015;
                } else if (vm.certifiedProduct.certificationEdition.name === '2014') {
                    vm.surveillanceTypes.surveillanceRequirements.criteriaOptions = vm.surveillanceTypes.surveillanceRequirements.criteriaOptions2014;
                }
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
                    certifiedProduct: '='
                },
                size: 'lg',
                controllerAs: 'vm',
                controller: 'SurveillanceController'
            };
        }]);
})();
