(function () {
    'use strict';

    angular.module('chpl.common')
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
                certifiedProduct: '='
            },
            size: 'lg',
            controllerAs: 'vm',
            controller: 'SurveillanceController'
        };
    }

    function SurveillanceController ($log, $scope, $uibModal, $filter, commonService, authService, utilService, API) {
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
            vm.uibModalInstance.result.then(function () {
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
            var title = '';
            if (surv.friendlyId) {
                title += surv.friendlyId + ': ';
            }
            title += closed ?
                'Closed Surveillance, Ended ' + $filter('date')(surv.endDate, 'mediumDate', 'UTC') + ': ' :
                'Open Surveillance, Began ' + $filter('date')(surv.startDate, 'mediumDate', 'UTC') + ': ';
            var nonconformityCount = 0;
            for (var i = 0; i < surv.requirements.length; i++) {
                for (var j = 0; j < surv.requirements[i].nonconformities.length; j++) {
                    if (surv.requirements[i].nonconformities[j].status.name === 'Open') {
                        nonconformityCount += 1;
                    }
                }
            }
            title += nonconformityCount;
            if (nonconformityCount !== 1) {
                title += ' Open Non-Conformities Found';
            } else {
                title += ' Open Non-Conformity Found';
            }
            return title;
        }

        function initiateSurveillance () {
            fixRequirementOptions();
            vm.uibModalInstance = $uibModal.open({
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
            vm.uibModalInstance.result.then(function () {
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
