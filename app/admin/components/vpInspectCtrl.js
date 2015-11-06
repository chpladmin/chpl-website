;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('InspectController', ['$modalInstance', 'inspectingCp', 'vendors', 'commonService', function ($modalInstance, inspectingCp, vendors, commonService) {
            var vm = this;

            vm.activate = activate;

            vm.loadDev = loadDev;
            vm.selectInspectingDeveloper = selectInspectingDeveloper;
            vm.saveInspectingDeveloper = saveInspectingDeveloper;

            vm.loadPrd = loadPrd;
            vm.selectInspectingProduct = selectInspectingProduct;
            vm.saveInspectingProduct = saveInspectingProduct;

            vm.next = next;
            vm.previous = previous;
            vm.isDisabled = isDisabled;

            vm.cancel = cancel;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.cp = angular.copy(inspectingCp);
                vm.stage = 'dev';

                //developer initiation
                vm.vendors = vendors;
                vm.developerChoice = 'choose';
                vm.loadDev();

                vm.products = [];
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
                if (vm.cp.developer.id) {
                    commonService.getProductsByVendor(vm.cp.product.id)
                        .then(function (result) {
                            vm.products = result;
                        });
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

            function next () {
                switch (vm.stage) {
                case 'dev':
                    vm.stage = 'prd';
                    vm.loadPrd();
                    break;
                case 'prd':
                    vm.stage = 'ver';
                    break;
                default:
                    break;
                }
            }

            function previous () {
                switch (vm.stage) {
                case 'prd': vm.stage = 'dev';
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
                default:
                    return true;
                }
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }
        }]);
})();
