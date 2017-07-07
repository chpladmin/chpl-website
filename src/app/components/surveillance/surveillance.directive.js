(function () {
    'use strict';

    angular.module('chpl')
        .controller('SurveillanceController', SurveillanceController)
        .directive('aiSurveillance', aiSurveillance);

    function aiSurveillance () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/surveillance/surveillance.html',
            scope: {},
            bindToController: {
                allowEditing: '=',
                certifiedProduct: '=',
            },
            size: 'lg',
            controllerAs: 'vm',
            controller: 'SurveillanceController',
        };
    }

    /** @ngInclude **/
    function SurveillanceController ($filter, $log, $scope, $uibModal, API, authService, commonService, utilService) {
        var vm = this;

        vm.editSurveillance = editSurveillance;
        vm.getTitle = getTitle;
        vm.initiateSurveillance = initiateSurveillance;
        vm.sortRequirements = utilService.sortRequirements;
        vm.sortResults = sortResults;
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
            vm.uibModalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/surveillance/edit.html',
                controller: 'EditSurveillanceController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    surveillance: function () { return surveillance; },
                    surveillanceTypes: function () { return vm.surveillanceTypes; },
                    workType: function () { return 'edit'; },
                },
            });
            vm.uibModalInstance.result.then(function () {
                commonService.getProduct(vm.certifiedProduct.id)
                    .then(function (result) {
                        vm.certifiedProduct = result;
                    });
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info(result);
                }
            });
        }

        function getTitle (surv) {
            var title = surv.endDate ?
                'Closed Surveillance, Ended ' + $filter('date')(surv.endDate, 'mediumDate', 'UTC') + ': ' :
                'Open Surveillance, Began ' + $filter('date')(surv.startDate, 'mediumDate', 'UTC') + ': ';
            var open = 0;
            var closed = 0;
            for (var i = 0; i < surv.requirements.length; i++) {
                for (var j = 0; j < surv.requirements[i].nonconformities.length; j++) {
                    if (surv.requirements[i].nonconformities[j].status.name === 'Open') {
                        open += 1;
                    }
                    if (surv.requirements[i].nonconformities[j].status.name === 'Closed') {
                        closed += 1;
                    }
                }
            }
            if (open && closed) {
                title += open + ' Open and ' + closed + ' Closed Non-Conformities Were Found';
            } else if (open) {
                if (open === 1) {
                    title += '1 Open Non-Conformity Was Found';
                } else {
                    title += open + ' Open Non-Conformities Were Found';
                }
            } else if (closed) {
                if (closed === 1) {
                    title += '1 Closed Non-Conformity Was Found';
                } else {
                    title += closed + ' Closed Non-Conformities Were Found';
                }
            } else {
                title += 'No Non-Conformities Were Found';
            }
            return title;
        }

        function initiateSurveillance () {
            fixRequirementOptions();
            vm.uibModalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/surveillance/edit.html',
                controller: 'EditSurveillanceController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    surveillance: function () { return { certifiedProduct: vm.certifiedProduct }; },
                    surveillanceTypes: function () { return vm.surveillanceTypes; },
                    workType: function () { return 'initiate'; },
                },
            });
            vm.uibModalInstance.result.then(function () {
                commonService.getProduct(vm.certifiedProduct.id)
                    .then(function (result) {
                        vm.certifiedProduct = result;
                    });
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info(result);
                }
            });
        }

        function sortResults (result) {
            var req = result.substring(result.indexOf(' for ') + 5);
            return vm.sortRequirements(req);
        }

        function surveillanceResults (surv) {
            var results = [];
            for (var i = 0; i < surv.requirements.length; i++) {
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
    }
})();
