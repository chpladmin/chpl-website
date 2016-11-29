;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('InspectController', ['$modalInstance', '$modal', 'inspectingCp', 'developers', 'isAcbAdmin', 'isAcbStaff', 'isChplAdmin', 'resources', 'commonService', function ($modalInstance, $modal, inspectingCp, developers, isAcbAdmin, isAcbStaff, isChplAdmin, resources, commonService) {
            var vm = this;

            vm.activate = activate;

            vm.loadDev = loadDev;
            vm.selectInspectingDeveloper = selectInspectingDeveloper;
            vm.saveInspectingDeveloper = saveInspectingDeveloper;

            vm.loadPrd = loadPrd;
            vm.selectInspectingProduct = selectInspectingProduct;
            vm.saveInspectingProduct = saveInspectingProduct;

            vm.loadVer = loadVer;
            vm.selectInspectingVersion = selectInspectingVersion;
            vm.saveInspectingVersion = saveInspectingVersion;

            vm.confirm = confirm;
            vm.reject = reject;
            vm.editCertifiedProduct = editCertifiedProduct;

            vm.next = next;
            vm.previous = previous;
            vm.isDisabled = isDisabled;

            vm.cancel = cancel;
            vm.ternaryFilter = ternaryFilter;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.cp = angular.copy(inspectingCp);
                vm.stage = 'dev';

                vm.developers = developers;
                vm.developerChoice = 'choose';
                vm.loadDev();

                vm.products = [];
                vm.productChoice = 'choose';

                vm.versions = [];
                vm.versionChoice = 'choose';

                vm.errorMessages = [];
                vm.isAcbAdmin = isAcbAdmin;
                vm.isAcbStaff = isAcbStaff;
                vm.isChplAdmin = isChplAdmin;
                vm.resources = resources;
                vm.statuses = resources.statuses;
                for (var i = 0; i < vm.statuses.length; i++) {
                    if (vm.statuses[i].name === 'Pending') {
                        vm.cp.certificationStatus = vm.statuses[i];
                        break;
                    }
                }
                if (!vm.cp.developer.country) {
                    vm.cp.developer.country = 'USA';
                }
            }

            function loadDev () {
                if (vm.cp.developer.developerId) {
                    commonService.getDeveloper(vm.cp.developer.developerId)
                        .then(function (result) {
                            vm.developer = result;
                        });
                }
            }

            function selectInspectingDeveloper() {
                vm.cp.developer.developerId = vm.developerSelect.developerId;
                vm.loadDev();
            }

            function saveInspectingDeveloper() {
                var dev = {
                    developer: {
                        name: vm.cp.developer.name,
                        status: vm.developer.status,
                        website: vm.cp.developer.website,
                        address: vm.cp.developer.address,
                        transparencyAttestations: [{acbId: vm.cp.certifyingBody.id, acbName: vm.cp.certifyingBody.name, attestation: vm.cp.transparencyAttestation}],
                        contact: vm.cp.developer.contact,
                        developerId: vm.cp.developer.developerId
                    },
                    developerIds: [vm.cp.developer.developerId]
                };
                if (!dev.developer.address.country) {
                    dev.developer.address.country = 'USA';
                }
                commonService.updateDeveloper(dev)
                    .then(function () {
                        vm.loadDev();
                    });
            }

            function loadPrd () {
                if (vm.developer && vm.developer.developerId) {
                    commonService.getProductsByDeveloper(vm.developer.developerId)
                        .then(function (result) {
                            vm.products = result.products;
                        });
                } else {
                    vm.productChoice = 'create';
                }
                if (vm.cp.product.id) {
                    commonService.getSimpleProduct(vm.cp.product.id)
                        .then(function (result) {
                            vm.product = result;
                        });
                }
            }

            function selectInspectingProduct() {
                vm.cp.product.id = vm.productSelect.productId;
                vm.loadPrd();
            }

            function saveInspectingProduct() {
                var prd = {
                    product: {
                        name: vm.cp.product.name,
                        productId: vm.cp.product.id
                    },
                    productIds: [vm.cp.product.id],
                    newDeveloperId: vm.cp.developer.developerId
                };
                commonService.updateProduct(prd)
                    .then(function () {
                        vm.loadPrd();
                    });
            }

            function loadVer () {
                if (vm.product && vm.product.productId) {
                    commonService.getVersionsByProduct(vm.product.productId)
                        .then(function (result) {
                            vm.versions = result;
                        });
                } else {
                    vm.versionChoice = 'create';
                }
                if (vm.cp.version.versionId) {
                    commonService.getVersion(vm.cp.version.versionId)
                        .then(function (result) {
                            vm.version = result;
                        });
                }
            }

            function selectInspectingVersion() {
                vm.cp.version.versionId = vm.versionSelect.versionId;
                vm.loadVer();
            }

            function saveInspectingVersion() {
                var ver = {
                    version: {
                        version: vm.cp.version.version,
                        productId: vm.cp.version.versionId
                    },
                    versionIds: [vm.cp.version.versionId]
                };
                commonService.updateVersion(ver)
                    .then(function () {
                        vm.loadVer();
                    });
            }

            function confirm () {
                commonService.confirmPendingCp(vm.cp)
                    .then(function (result) {
                        $modalInstance.close({status: 'confirmed', developerCreated: vm.developerChoice === 'create', developer: result.developer});
                    }, function (error) {
                        vm.errorMessages = error.data.errorMessages;
                    });
            }

            function reject () {
                commonService.rejectPendingCp(vm.cp.id)
                    .then(function () {
                        $modalInstance.dismiss('rejected');
                    });
            }

            function editCertifiedProduct () {
                vm.editModalInstance = $modal.open({
                    templateUrl: 'admin/components/vpEditCertifiedProduct.html',
                    controller: 'EditCertifiedProductController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        activeCP: function () { return vm.cp; },
                        isAcbAdmin: function () { return vm.isAcbAdmin; },
                        isAcbStaff: function () { return vm.isAcbStaff; },
                        isChplAdmin: function () { return vm.isChplAdmin; },
                        resources: function () { return vm.resources; },
                        workType: function () { return 'confirm'; }
                    }
                });
                vm.editModalInstance.result.then(function (result) {
                    vm.cp = result;
                }, function (result) {
                    if (result !== 'cancelled') {
                        console.debug('dismissed', result);
                    }
                });
            }

            function next () {
                switch (vm.stage) {
                case 'dev':
                    vm.stage = 'prd';
                    vm.loadPrd();
                    break;
                case 'prd':
                    vm.stage = 'ver';
                    vm.loadVer();
                    break;
                case 'ver':
                    vm.stage = 'cp';
                    break;
                default:
                    break;
                }
            }

            function previous () {
                switch (vm.stage) {
                case 'prd': vm.stage = 'dev';
                    break;
                case 'ver': vm.stage = 'prd';
                    break;
                case 'cp': vm.stage = 'ver';
                    break;
                default:
                    break;
                }
            }

            function isDisabled () {
                switch (vm.stage) {
                case 'dev':
                    if (vm.developerChoice === 'choose' && !vm.cp.developer.developerId)
                        return true;
                    return false;
                    break;
                case 'prd':
                    if (vm.productChoice === 'choose' && !vm.cp.product.id)
                        return true;
                    return false;
                    break;
                case 'ver':
                    if (vm.versionChoice === 'choose' && !vm.cp.version.versionId)
                        return true;
                    return false;
                    break;
                default:
                    return true;
                }
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function ternaryFilter (field) {
                if (field == null) {
                    return 'N/A';
                } else {
                    return field ? 'True' : 'False';
                }
            }
        }]);
})();
