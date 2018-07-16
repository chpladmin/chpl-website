(function () {
    'use strict';

    angular.module('chpl')
        .controller('CertificationCriteriaController', CertificationCriteriaController)
        .directive('aiCertificationCriteria', aiCertificationCriteria);

    /** @ngInject */
    function aiCertificationCriteria () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/listing_details/criteria.html',
            bindToController: {
                accessibilityStandards: '=?',
                cert: '=',
                hasIcs: '=',
                isEditing: '=',
                qmsStandards: '=?',
                refreshSed: '&?',
                resources: '=',
                viewAll: '=',
            },
            scope: {},
            controllerAs: 'vm',
            controller: 'CertificationCriteriaController',
        };
    }

    /** @ngInject */
    function CertificationCriteriaController ($analytics, $log, $uibModal) {
        var vm = this;

        vm.editCert = editCert;
        vm.hasPhantomData = hasPhantomData;
        vm.showViewDetailsLink = showViewDetailsLink;
        vm.toggleCriteria = toggleCriteria;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
        }

        function editCert () {
            var backupCert = angular.copy(vm.cert);
            vm.editUibModalInstance = $uibModal.open({
                templateUrl: 'app/components/listing_details/criteriaModal.html',
                controller: 'EditCertificationCriteriaController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    cert: function () { return vm.cert; },
                    hasIcs: function () { return vm.hasIcs; },
                    resources: function () { return vm.resources; },
                },
            });
            vm.editUibModalInstance.result.then(function () {
                vm.refreshSed();
            }, function () {
                vm.cert = angular.copy(backupCert);
            });
        }

        function hasPhantomData () {
            var ret =
                (vm.cert.additionalSoftware && vm.cert.additionalSoftware.length > 0) ||
                (vm.cert.apiDocumentation && vm.cert.apiDocumentation.length > 0) ||
                (vm.cert.gap) ||
                (vm.cert.privacySecurityFramework && vm.cert.privacySecurityFramework.length > 0) ||
                (vm.cert.sed) ||
                (vm.cert.testDataUsed && vm.cert.testDataUsed.length > 0) ||
                (vm.cert.testFunctionality && vm.cert.testFunctionality.length > 0) ||
                (vm.cert.testProcedures && vm.cert.testProcedures.length > 0) ||
                (vm.cert.testStandards && vm.cert.testStandards.length > 0) ||
                (vm.cert.testToolsUsed && vm.cert.testToolsUsed.length > 0) ||
                false;
            return ret;
        }

        function showViewDetailsLink () {
            return (vm.cert.success && vm.cert.additionalSoftware !== null) ||
                ((!vm.cert.success) &&
                ((vm.cert.g1MacraMeasures && vm.cert.g1MacraMeasures.length > 0) ||
                    (vm.cert.g2MacraMeasures && vm.cert.g2MacraMeasures.length > 0)) ||
                    vm.cert.g1Success !== null ||
                    vm.cert.g2Success !== null);
        }

        function toggleCriteria () {
            if (!vm.showDetails) {
                $analytics.eventTrack('Viewed criteria details', { category: 'Listing Details', label: vm.cert.number });
            }
            vm.showDetails = !vm.showDetails
        }
    }
})();
