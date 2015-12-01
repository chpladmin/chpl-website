;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('InspectController', ['$modalInstance', '$modal', 'inspectingCp', 'vendors', 'classifications', 'practices', 'isAcbAdmin', 'isAcbStaff', 'isChplAdmin', 'bodies', 'statuses', 'commonService', function ($modalInstance, $modal, inspectingCp, vendors, classifications, practices, isAcbAdmin, isAcbStaff, isChplAdmin, bodies, statuses, commonService) {
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

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.cp = angular.copy(inspectingCp);
                vm.stage = 'dev';

                vm.vendors = vendors;
                vm.developerChoice = 'choose';
                vm.loadDev();

                vm.products = [];
                vm.productChoice = 'choose';

                vm.versions = [];
                vm.versionChoice = 'choose';

                vm.classifications = classifications;
                vm.practices = practices;
                vm.isAcbAdmin = isAcbAdmin;
                vm.isAcbStaff = isAcbStaff;
                vm.isChplAdmin = isChplAdmin;
                vm.bodies = bodies;
                vm.statuses = statuses;
                for (var i = 0; i < vm.statuses.length; i++) {
                    if (vm.statuses[i].name === 'Pending') {
                        vm.cp.certificationStatus = vm.statuses[i];
                        break;
                    }
                }
            }

            function loadDev () {
                if (vm.cp.vendor.id) {
                    commonService.getVendor(vm.cp.vendor.id)
                        .then(function (result) {
                            vm.developer = result;
                        });
                }
            }

            function selectInspectingDeveloper() {
                vm.cp.vendor.id = vm.developerSelect.vendorId;
                vm.loadDev();
            }

            function saveInspectingDeveloper() {
                var dev = {
                    vendor: {
                        name: vm.cp.vendor.name,
                        website: vm.cp.vendor.website,
                        address: vm.cp.vendorAddress,
                        vendorId: vm.cp.vendor.id
                    },
                    vendorIds: [vm.cp.vendor.id]
                };
                if (!dev.vendor.address.country) {
                    dev.vendor.address.country = 'USA';
                }
                commonService.updateVendor(dev)
                    .then(function () {
                        vm.loadDev();
                    });
            }

            function loadPrd () {
                if (vm.developer && vm.developer.vendorId) {
                    commonService.getProductsByVendor(vm.developer.vendorId)
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
                    newVendorId: vm.cp.vendor.id
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
                if (vm.cp.product.versionId) {
                    commonService.getVersion(vm.cp.product.versionId)
                        .then(function (result) {
                            vm.version = result;
                        });
                }
            }

            function selectInspectingVersion() {
                vm.cp.product.versionId = vm.versionSelect.versionId;
                vm.loadVer();
            }

            function saveInspectingVersion() {
                var ver = {
                    version: {
                        version: vm.cp.product.version,
                        productId: vm.cp.product.versionId
                    },
                    versionIds: [vm.cp.product.versionId]
                };
                commonService.updateVersion(ver)
                    .then(function () {
                        vm.loadVer();
                    });
            }

            function confirm () {
                commonService.confirmPendingCp(vm.cp)
                    .then(function () {
                        $modalInstance.close('confirmed');
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
                    resolve: {
                        activeCP: function () { return vm.cp; },
                        classifications: function () { return vm.classifications; },
                        practices: function () { return vm.practices; },
                        isAcbAdmin: function () { return vm.isAcbAdmin; },
                        isAcbStaff: function () { return vm.isAcbStaff; },
                        isChplAdmin: function () { return vm.isChplAdmin; },
                        bodies: function () { return vm.bodies; },
                        statuses: function () { return vm.statuses; },
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
                    if (vm.developerChoice === 'choose' && !vm.cp.vendor.id)
                        return true;
                    return false;
                    break;
                case 'prd':
                    if (vm.productChoice === 'choose' && !vm.cp.product.id)
                        return true;
                    return false;
                    break;
                case 'ver':
                    if (vm.versionChoice === 'choose' && !vm.cp.product.versionId)
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
        }]);
})();
