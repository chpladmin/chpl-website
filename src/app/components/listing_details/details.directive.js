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
            templateUrl: 'chpl.components/listing_details/details.html',
            bindToController: {
                cap: '=',
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
        function CertsController ($analytics, $log, $scope, $uibModal, ACTIVE_CAP, networkService, utilService) {
            var vm = this;

            vm.ACTIVE_CAP = ACTIVE_CAP;
            vm.hasEdited = hasEdited;
            vm.muuCount = utilService.muuCount;
            vm.prepCqms = prepCqms
            vm.registerSed = registerSed;
            vm.sortCerts = sortCerts;
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

            function sortCerts (cert) {
                var ret = 0;
                if (cert.number) {
                    var letter;
                    var number;
                    letter = cert.number.substring(9,10);
                    if (cert.number.substring(0,6) === '170.30') {
                        number = cert.number.substring(6,7);
                        ret = parseInt(number) * 100 + letter.charCodeAt(0);
                    } else {
                        number = cert.number.substring(12,14);
                        if (number.substring(1,2) === ')') {
                            number = number.substring(0,1);
                        }
                        ret = letter.charCodeAt(0) * 100 + parseInt(number);
                    }
                }
                return ret;
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
                for (var i = 0; i < vm.cqms.length; i++) {
                    vm.cqms[i].criteria = [];
                    if (vm.cqms[i].success || vm.cqms[i].successVersions.length > 0) {
                        for (var j = 1; j < 5; j++) {
                            if (vm.cqms[i]['hasC' + j]) {
                                vm.cqms[i].criteria.push({certificationNumber: '170.315 (c)(' + j + ')'});
                            }
                        }
                    }
                }
            }

            function viewIcsFamily () {
                networkService.getIcsFamily(vm.product.id).then(function (family) {
                    vm.uibModalInstance = $uibModal.open({
                        templateUrl: 'chpl.components/listing_details/ics_family/icsFamilyModal.html',
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
