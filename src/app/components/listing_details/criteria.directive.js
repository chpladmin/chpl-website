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
                cert: '=',
                hasIcs: '=',
                viewAll: '=',
                isEditing: '=',
                resources: '=',
                accessibilityStandards: '=?',
                qmsStandards: '=?',
                save: '&',
            },
            scope: {},
            controllerAs: 'vm',
            controller: 'CertificationCriteriaController',
            link: function (scope, element, attr, ctrl) {
                var handler = ctrl.save({
                    handler: function () {
                        ctrl.saveEdits();
                    },
                });
                scope.$on('$destroy', handler);
            },
        };
    }

    /** @ngInject */
    function CertificationCriteriaController ($analytics, $log, $uibModal) {
        var vm = this;

        vm.editCert = editCert;
        vm.hasPhantomData = hasPhantomData;
        vm.saveEdits = saveEdits;
        vm.toggleCriteria = toggleCriteria;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
        }

        function editCert () {
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
            vm.editUibModalInstance.result.then(function (result) {
                vm.cert = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info('dismissed', result);
                }
            });
        }

        function hasPhantomData () {
            var ret =
                (vm.cert.additionalSoftware && vm.cert.additionalSoftware.length > 0) ||
                (vm.cert.apiDocumentation && vm.cert.apiDocumentation.length > 0) ||
                (vm.cert.g1MacraMeasures && vm.cert.g1MacraMeasures.length > 0) ||
                (vm.cert.g1Success) ||
                (vm.cert.g2MacraMeasures && vm.cert.g2MacraMeasures.length > 0) ||
                (vm.cert.g2Success) ||
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

        /*
         * remove any keys where the select used 'vm.options' and the display was N/A
         */
        function saveEdits () {
            if (vm.cert.gap === 'null') {
                delete (vm.cert.gap);
            }
            if (vm.cert.g1Success === 'null') {
                delete (vm.cert.g1Success);
            }
            if (vm.cert.g2Success === 'null') {
                delete (vm.cert.g2Success);
            }
            if (vm.cert.sed === 'null') {
                delete (vm.cert.sed);
            }
        }

        function toggleCriteria () {
            if (!vm.showDetails) {
                $analytics.eventTrack('Viewed criteria details', { category: 'Listing Details', label: vm.cert.number });
            }
            vm.showDetails = !vm.showDetails
        }
    }
})();
