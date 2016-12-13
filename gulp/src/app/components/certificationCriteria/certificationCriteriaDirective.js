(function () {
    'use strict';

    angular.module('chpl.common')
        .controller('CertificationCriteriaController', CertificationCriteriaController)
        .directive('aiCertificationCriteria', aiCertificationCriteria);

    /** @ngInject */
    function aiCertificationCriteria () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/certificationCriteria/certificationCriteria.html',
            bindToController: {
                cert: '=',
                viewAll: '=',
                isEditing: '=',
                resources: '=',
                save: '&'
            },
            scope: {},
            controllerAs: 'vm',
            controller: 'CertificationCriteriaController',
            link: function (scope, element, attr, ctrl) {
                var handler = ctrl.save({
                    handler: function () {
                        ctrl.saveEdits();
                    }
                });
                scope.$on('$destroy', handler);
            }
        };
    }

    /** @ngInject */
    function CertificationCriteriaController ($scope, $log, $uibModal) {
        var vm = this;

        vm.editCert = editCert;
        vm.saveEdits = saveEdits;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
        }

        function editCert () {
            vm.editUibModalInstance = $uibModal.open({
                templateUrl: 'app/components/certificationCriteria/certificationCriteriaUibModal.html',
                controller: 'EditCertificationCriteriaController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    cert: function () { return vm.cert; },
                    resources: function () { return vm.resources; }
                }
            });
            vm.editUibModalInstance.result.then(function (result) {
                vm.cert = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug('dismissed', result);
                }
            });
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
    }
})();
