(function () {
    'use strict';

    angular
        .module('chpl.components')
        .directive('aiCerts', aiCerts);

    /** @ngInject */
    function aiCerts () {
        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: 'chpl.components/listing/details/details.html',
            bindToController: {
                editMode: '=?',
                initialPanel: '@?',
                isConfirming: '=',
                isEditing: '=?',
                product: '=',
                resources: '=',
                viewAllCerts: '=?defaultAll',
            },
            scope: {},
            controller: CertsController,
            controllerAs: 'vm',
        };
        return directive;

        /** @ngInject */
        function CertsController ($analytics, $log, $scope, $uibModal, networkService, utilService) {
            var vm = this;

            vm.hasEdited = hasEdited;
            vm.muuCount = utilService.muuCount;
            vm.prepCqms = prepCqms
            vm.registerSed = registerSed;
            vm.saveCert = saveCert;
            vm.sortCerts = utilService.sortCert;
            vm.sortCqms = sortCqms;
            vm.showPanel = showPanel;
            vm.updateCs = updateCs;
            vm.viewIcsFamily = viewIcsFamily;

            ////////////////////////////////////////////////////////////////////

            this.$onInit = function () {
                vm.handlers = [];
                if (angular.isUndefined(vm.isEditing)) {
                    vm.isEditing = false;
                }
                if (angular.isUndefined(vm.viewAllCerts)) {
                    vm.viewAllCerts = false;
                }
                if (vm.initialPanel) {
                    if (vm.initialPanel !== 'none') {
                        vm.panelShown = vm.initialPanel;
                    }
                } else {
                    vm.panelShown = 'cert';
                }
                $scope.$watch('vm.product', function (product) {
                    if (product) {
                        vm.product = product;
                        vm.countCerts = vm.product.countCerts;
                        vm.countCqms = vm.product.countCqms;
                        vm.cqms = vm.product.cqmResults;
                        vm.prepCqms();
                    }}, true);
            }

            function hasEdited () {
                angular.forEach(vm.handlers, function (handler) {
                    handler();
                });
            }

            function prepCqms () {
                if (vm.cqms) {
                    for (var i = 0; i < vm.cqms.length; i++) {
                        vm.cqms[i].id = i;
                        for (var j = 1; j < 5; j++) {
                            vm.cqms[i]['hasC' + j] = checkC(vm.cqms[i], j);
                        }
                    }
                }
            }

            function registerSed (handler) {
                vm.handlers.push(handler);
                var removeHandler = function () {
                    vm.handlers = vm.handlers.filter(function (aHandler) {
                        return aHandler !== handler;
                    });
                };
                return removeHandler;
            }

            function saveCert (cert) {
                for (let i = 0; i < vm.product.certificationResults.length; i++) {
                    if (vm.product.certificationResults[i].number === cert.number
                        && vm.product.certificationResults[i].title === cert.title) {
                        vm.product.certificationResults[i] = cert;
                    }
                }
                vm.updateCs();
            }

            function sortCqms (cqm) {
                var ret = 0;
                if (cqm.cmsId) {
                    ret = parseInt(cqm.cmsId.substring(3));
                } else {
                    ret = parseInt(cqm.nqfNumber);
                }
                return ret;
            }

            function showPanel (panel) {
                if (vm.panelShown !== panel) {
                    switch (panel) {
                    case 'cert':
                        $analytics.eventTrack('Viewed Criteria', { category: 'Listing Details', label: vm.product.chplProductNumber});
                        break;
                    case 'cqm':
                        $analytics.eventTrack('Viewed CQM Details', { category: 'Listing Details', label: vm.product.chplProductNumber});
                        break;
                    case 'additional':
                        $analytics.eventTrack('Viewed additional information', { category: 'Listing Details', label: vm.product.chplProductNumber});
                        break;
                    case 'surveillance':
                        $analytics.eventTrack('Viewed surveillance information', { category: 'Listing Details', label: vm.product.chplProductNumber});
                        break;
                    case 'g1g2':
                        $analytics.eventTrack('Viewed G1/G2 information', { category: 'Listing Details', label: vm.product.chplProductNumber});
                        break;
                    case 'sed':
                        $analytics.eventTrack('Viewed SED information', { category: 'Listing Details', label: vm.product.chplProductNumber});
                        break;
                        // no default
                    }
                }

                vm.panelShown = vm.panelShown === panel ? '' : panel;
            }

            function updateCs () {
                vm.cqms.forEach(cqm => {
                    cqm.criteria = [];
                    if (cqm.success || cqm.successVersions.length > 0) {
                        for (var j = 1; j < 5; j++) {
                            if (cqm['hasC' + j]) {
                                let number = '170.315 (c)(' + j + ')';
                                //let criterion = vm.product.certificationResults.find(cert => cert.number === number && cert.success) || {};
                                //criterion = criterion.criterion;
                                cqm.criteria.push({
                                    certificationNumber: number,
                                    //criterion: criterion,
                                });
                            }
                        }
                    }
                });
            }

            function viewIcsFamily () {
                networkService.getIcsFamily(vm.product.id).then(function (family) {
                    vm.uibModalInstance = $uibModal.open({
                        templateUrl: 'chpl.components/listing/details/ics-family/ics-family-modal.html',
                        controller: 'IcsFamilyController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'lg',
                        resolve: {
                            family: function () { return family; },
                            listing: function () { return vm.product; },
                        },
                    });
                });
            }

            ////////////////////////////////////////////////////////////////////

            function checkC (cqm, num) {
                var ret;
                if (angular.isUndefined(cqm['hasC' + num])) {
                    ret = false;
                    if (cqm.criteria) {
                        for (var i = 0; i < cqm.criteria.length; i++) {
                            ret = ret || (cqm.criteria[i].certificationNumber === '170.315 (c)(' + num + ')')
                        }
                    }
                } else {
                    ret = cqm['hasC' + num];
                }
                return ret
            }
        }
    }
})();
