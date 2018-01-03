(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('InspectController', InspectController);

    /** @ngInject */
    function InspectController ($log, $uibModal, $uibModalInstance, developers, inspectingCp, isAcbAdmin, isChplAdmin, networkService, resources, utilService) {
        var vm = this;

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

        vm.certificationStatus = utilService.certificationStatus;

        activate();

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
                networkService.getDeveloper(vm.cp.developer.developerId)
                    .then(function (result) {
                        vm.developer = result;
                    });
            }
        }

        function selectInspectingDeveloper () {
            vm.cp.developer.developerId = vm.developerSelect.developerId;
            vm.loadDev();
        }

        function saveInspectingDeveloper () {
            var dev = {
                developer: {
                    address: vm.cp.developer.address,
                    contact: vm.cp.developer.contact,
                    developerCode: vm.developer.developerCode,
                    developerId: vm.cp.developer.developerId,
                    name: vm.cp.developer.name,
                    status: vm.developer.status,
                    statusEvents: vm.developer.statusEvents,
                    transparencyAttestations: [{acbId: vm.cp.certifyingBody.id, acbName: vm.cp.certifyingBody.name, attestation: vm.cp.transparencyAttestation}],
                    website: vm.cp.developer.website,
                },
                developerIds: [vm.cp.developer.developerId],
            };
            if (!dev.developer.address.country) {
                dev.developer.address.country = 'USA';
            }
            networkService.updateDeveloper(dev)
                .then(function () {
                    vm.loadDev();
                });
        }

        function loadPrd () {
            if (vm.developer && vm.developer.developerId) {
                networkService.getProductsByDeveloper(vm.developer.developerId)
                    .then(function (result) {
                        vm.products = result.products;
                    });
            } else {
                vm.productChoice = 'create';
            }
            if (vm.cp.product.productId) {
                networkService.getSimpleProduct(vm.cp.product.productId)
                    .then(function (result) {
                        vm.product = result;
                    });
            }
        }

        function selectInspectingProduct () {
            vm.cp.product.productId = vm.productSelect.productId;
            vm.loadPrd();
        }

        function saveInspectingProduct () {
            var prd = {
                product: {
                    name: vm.cp.product.name,
                    productId: vm.cp.product.productId,
                },
                productIds: [vm.cp.product.productId],
                newDeveloperId: vm.cp.developer.developerId,
            };
            networkService.updateProduct(prd)
                .then(function () {
                    vm.loadPrd();
                });
        }

        function loadVer () {
            if (vm.product && vm.product.productId) {
                networkService.getVersionsByProduct(vm.product.productId)
                    .then(function (result) {
                        vm.versions = result;
                    });
            } else {
                vm.versionChoice = 'create';
            }
            if (vm.cp.version.versionId) {
                networkService.getVersion(vm.cp.version.versionId)
                    .then(function (result) {
                        vm.version = result;
                    });
            }
        }

        function selectInspectingVersion () {
            vm.cp.version.versionId = vm.versionSelect.versionId;
            vm.loadVer();
        }

        function saveInspectingVersion () {
            var ver = {
                version: {
                    version: vm.cp.version.version,
                    productId: vm.cp.version.versionId,
                },
                versionIds: [vm.cp.version.versionId],
            };
            networkService.updateVersion(ver)
                .then(function () {
                    vm.loadVer();
                });
        }

        function confirm () {
            networkService.confirmPendingCp(vm.cp)
                .then(function (result) {
                    $uibModalInstance.close({status: 'confirmed', developerCreated: vm.developerChoice === 'create', developer: result.developer});
                }, function (error) {
                    if (error.data.contact) {
                        $uibModalInstance.close({
                            contact: error.data.contact,
                            objectId: error.data.objectId,
                            status: 'resolved',
                        });
                    } else {
                        vm.errorMessages = error.data.errorMessages;
                    }
                });
        }

        function reject () {
            networkService.rejectPendingCp(vm.cp.id)
                .then(function () {
                    $uibModalInstance.close({status: 'rejected'});
                }, function (error) {
                    if (error.data.contact) {
                        $uibModalInstance.close({
                            contact: error.data.contact,
                            objectId: error.data.objectId,
                            status: 'resolved',
                        });
                    } else {
                        vm.errorMessages = error.data.errorMessages;
                    }
                });
        }

        function editCertifiedProduct () {
            vm.editModalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/certifiedProduct/listing/edit.html',
                controller: 'EditCertifiedProductController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    activeCP: function () { return vm.cp; },
                    isAcbAdmin: function () { return vm.isAcbAdmin; },
                    isChplAdmin: function () { return vm.isChplAdmin; },
                    resources: function () { return vm.resources; },
                    workType: function () { return 'confirm'; },
                },
            });
            vm.editModalInstance.result.then(function (result) {
                vm.cp = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug('dismissed', result);
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
                loadFamily();
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
                if (vm.developerChoice === 'choose' && !vm.cp.developer.developerId) {
                    return true;
                }
                return false;
            case 'prd':
                if (vm.productChoice === 'choose' && !vm.cp.product.productId) {
                    return true;
                }
                return false;
            case 'ver':
                if (vm.versionChoice === 'choose' && !vm.cp.version.versionId) {
                    return true;
                }
                return false;
            default:
                return true;
            }
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function ternaryFilter (field) {
            if (field === null) {
                return 'N/A';
            } else {
                return field ? 'True' : 'False';
            }
        }

        ////////////////////////////////////////////////////////////////////

        function loadFamily () {
            if (vm.product && vm.product.productId) {
                networkService.getRelatedListings(vm.product.productId)
                    .then(function (family) {
                        vm.resources.relatedListings = family.filter(function (item) { return item.edition === '2015' });
                    });
            }
        }
    }
})();
