(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('VpManagementController', VpManagementController)
        .directive('aiVpManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'chpl.admin/components/certifiedProduct/management.html',
                bindToController: {
                    workType: '=?',
                    pendingProducts: '=?',
                    pendingSurveillances: '=?',
                    productId: '=',
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'VpManagementController',
            };
        });

    /** @ngInject */
    function VpManagementController ($log, $uibModal, API, authService, featureFlags, networkService, utilService) {
        var vm = this;

        vm.areResourcesReady = areResourcesReady;
        vm.certificationStatus = utilService.certificationStatus;
        vm.doWork = doWork;
        vm.editCertifiedProduct = editCertifiedProduct;
        vm.editDeveloper = editDeveloper;
        vm.editProduct = editProduct;
        vm.editVersion = editVersion;
        vm.hasAnyRole = authService.hasAnyRole;
        vm.isDeveloperEditable = isDeveloperEditable;
        vm.isDeveloperMergeable = isDeveloperMergeable;
        vm.isOn = featureFlags.isOn;
        vm.isProductEditable = isProductEditable;
        vm.isDeveloperBanned = isDeveloperBanned;
        vm.isTransparencyAttestationViewable = isTransparencyAttestationViewable;
        vm.isTransparencyAttestationRemoved = isTransparencyAttestationRemoved;
        vm.loadCp = loadCp;
        vm.loadSurveillance = loadSurveillance;
        vm.mergeDevelopers = mergeDevelopers;
        vm.mergeProducts = mergeProducts;
        vm.mergeVersions = mergeVersions;
        vm.refreshDevelopers = refreshDevelopers;
        vm.refreshPending = refreshPending;
        vm.searchForSurveillance = searchForSurveillance;
        vm.selectCp = selectCp;
        vm.selectDeveloper = selectDeveloper;
        vm.selectProduct = selectProduct;
        vm.selectVersion = selectVersion;
        vm.splitProduct = splitProduct;
        vm.splitDeveloper = splitDeveloper;
        vm.ternaryFilter = utilService.ternaryFilter;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.activeDeveloper = '';
            vm.activeProduct = '';
            vm.activeVersion = '';
            vm.activeCP = '';
            if (angular.isUndefined(vm.workType)) {
                vm.workType = 'manage';
            }
            vm.mergeType = 'developer';
            vm.resources = {};
            vm.forceRefresh = false;
            vm.refreshDevelopers();
            vm.refreshPending();

            networkService.getAcbs(true).then(result => vm.surveillanceAllowedAcbs = result);
            networkService.getCollection('surveillanceManagement').then(result => vm.surveillanceListings = result);
            getResources();
        }

        function areResourcesReady () {
            return vm.resourcesReady.searchOptions &&
                vm.resourcesReady.atls &&
                vm.resourcesReady.qmsStandards &&
                vm.resourcesReady.accessibilityStandards &&
                vm.resourcesReady.ucdProcesses &&
                vm.resourcesReady.testProcedures &&
                vm.resourcesReady.testData &&
                vm.resourcesReady.testStandards &&
                vm.resourcesReady.testFunctionality &&
                vm.resourcesReady.testTools &&
                vm.resourcesReady.targetedUsers;
        }

        function refreshDevelopers () {
            networkService.getDevelopers()
                .then(function (developers) {
                    vm.developers = developers.developers;
                    prepCodes();

                    if (isEditingListing() && vm.workType === 'manage') {
                        vm.loadCp();
                    } else if (isEditingListing() && vm.workType === 'manageSurveillance') {
                        vm.loadSurveillance();
                    }
                });
        }

        function refreshPending () {
            if (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ACB'])) {
                networkService.getPendingListings()
                    .then(function (listings) {
                        vm.pendingProducts = listings.length;
                    })
            }
            networkService.getUploadingSurveillances()
                .then(function (surveillances) {
                    vm.pendingSurveillances = ([].concat(surveillances.pendingSurveillance)).length;
                })
        }

        function selectDeveloper () {
            if (vm.developerSelect) {
                vm.activeDeveloper = vm.developerSelect;
                networkService.getProductsByDeveloper(vm.activeDeveloper.developerId)
                    .then(function (products) {
                        vm.products = products.products;
                    });
                vm.mergeDeveloper = angular.copy(vm.activeDeveloper);
                delete vm.mergeDeveloper.developerId;
                delete vm.mergeDeveloper.lastModifiedDate;
            }
        }

        function editDeveloper () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/certifiedProduct/developer/edit.html',
                controller: 'EditDeveloperController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    activeDeveloper: function () { return vm.activeDeveloper; },
                    activeAcbs: function () { return vm.activeAcbs; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                vm.developerMessage = null;
                vm.activeDeveloper = result;
                networkService.getDevelopers()
                    .then(function (developers) {
                        vm.developers = developers.developers;
                        prepCodes();
                        for (var i = 0; i < vm.developers.length; i++) {
                            if (result.developerId === vm.developers[i].developerId) {
                                vm.activeDeveloper = vm.developers[i];
                            }
                        }
                    });
            }, function (result) {
                if (result !== 'cancelled') {
                    vm.developerMessage = result;
                }
            });
        }

        function mergeDevelopers () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/certifiedProduct/developer/merge.html',
                controller: 'MergeDeveloperController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    developers: function () { return vm.mergingDevelopers; },
                },
            });
            vm.modalInstance.result.then(function () {
                vm.developerMessage = null;
                networkService.getDevelopers()
                    .then(function (developers) {
                        vm.developers = developers.developers;
                        prepCodes();
                    });
            }, function (result) {
                if (result !== 'cancelled') {
                    vm.developerMessage = result;
                }
            });
        }

        function selectProduct () {
            if (vm.productSelect) {
                vm.activeProduct = vm.productSelect;
                vm.activeProduct.developerId = vm.activeDeveloper.developerId;
                networkService.getVersionsByProduct(vm.activeProduct.productId)
                    .then(function (versions) {
                        vm.versions = versions;
                    });
                vm.mergeProduct = angular.copy(vm.activeProduct);
                delete vm.mergeProduct.productId;
                delete vm.mergeProduct.lastModifiedDate;
            }
        }

        function editProduct () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/certifiedProduct/product/edit.html',
                controller: 'EditProductController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    activeProduct: function () { return vm.activeProduct; },
                },
            });
            vm.productMessage = null;
            vm.modalInstance.result.then(function (result) {
                vm.activeProduct = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    vm.productMessage = result;
                }
            });
        }

        function mergeProducts () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/certifiedProduct/product/merge.html',
                controller: 'MergeProductController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    products: function () { return vm.mergingProducts; },
                    developerId: function () { return vm.activeDeveloper.developerId; },
                },
            });
            vm.modalInstance.result.then(function () {
                vm.productMessage = null;
                networkService.getProductsByDeveloper(vm.activeDeveloper.developerId)
                    .then(function (products) {
                        vm.products = products.products;
                    });
            }, function (result) {
                if (result !== 'cancelled') {
                    vm.productMessage = result;
                }
            });
        }

        function mergeVersions () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/certifiedProduct/version/merge.html',
                controller: 'MergeVersionController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    versions: function () { return vm.mergingVersions; },
                    productId: function () { return vm.activeProduct.productId; },
                },
            });
            vm.modalInstance.result.then(function () {
                vm.productMessage = null;
                networkService.getVersionsByProduct(vm.activeProduct.productId)
                    .then(function (versions) {
                        vm.versions = versions;
                    });
            }, function (result) {
                if (result !== 'cancelled') {
                    vm.productMessage = result;
                }
            });
        }

        function selectVersion () {
            if (vm.versionSelect) {
                vm.activeVersion = vm.versionSelect;
                vm.activeVersion.productId = vm.activeProduct.productId;
                networkService.getProductsByVersion(vm.activeVersion.versionId, true)
                    .then(function (cps) {
                        vm.cps = cps;
                    });
                vm.mergeVersion = angular.copy(vm.activeVersion);
                delete vm.mergeVersion.versionId;
                delete vm.mergeVersion.lastModifiedDate;
            }
        }

        function editVersion () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/certifiedProduct/version/edit.html',
                controller: 'EditVersionController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    activeVersion: function () { return vm.activeVersion; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                vm.activeVersion = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    vm.versionMessage = result;
                }
            });
        }

        function selectCp () {
            if (vm.cpSelect) {
                vm.activeCP = {};
                vm.activeCP.certifyingBody = {};
                vm.activeCP.practiceType = {};
                vm.activeCP.classificationType = {};
                networkService.getListing(vm.cpSelect, vm.forceRefresh)
                    .then(function (cp) {
                        vm.activeCP = cp;
                        vm.activeCP.certDate = new Date(vm.activeCP.certificationDate);
                        vm.forceRefresh = false;
                    })
            }
        }

        function editCertifiedProduct () {
            var resources = angular.copy(vm.resources);
            var filteredFunctionality = resources.testFunctionalities.data.filter(function (item) {
                return !item.year || item.year === vm.activeCP.certificationEdition.name;
            });
            resources.testFunctionalities.data = filteredFunctionality;
            var filteredTestStandards = resources.testStandards.data.filter(function (item) {
                return !item.year || item.year === vm.activeCP.certificationEdition.name;
            });
            resources.testStandards.data = filteredTestStandards;
            vm.modalInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/certifiedProduct/listing/edit.html',
                controller: 'EditCertifiedProductController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    activeCP: function () { return vm.activeCP; },
                    isAcbAdmin: function () { return vm.hasAnyRole(['ROLE_ACB']); },
                    isChplAdmin: function () { return vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']); },
                    resources: function () { return resources; },
                    workType: function () { return vm.workType; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                vm.activeCP = result;
                getResources();
                vm.productId = result.id;
                vm.refreshDevelopers();
                vm.forceRefresh = true;
                vm.loadCp();
            }, function (result) {
                if (result !== 'cancelled') {
                    vm.cpMessage = result;
                } else {
                    $log.info(result);
                }
            });
        }

        function isDeveloperEditable (dev) {
            return dev.status.status === 'Active' || vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']);
        }

        function isDeveloperMergeable (dev) {
            return dev.status.status === 'Active';
        }

        function isDeveloperBanned (dev) {
            return dev.status.status === 'Under certification ban by ONC';
        }

        function isProductEditable (cp) {
            if (cp.certificationEdition.name === '2014' && featureFlags.isOn('effective-rule-date-plus-one-week') && vm.hasAnyRole(['ROLE_ACB'])) {
                return false;
            }
            if (cp.certificationEvents) {
                return (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) && (vm.isDeveloperMergeable(vm.activeDeveloper) || vm.isDeveloperBanned(vm.activeDeveloper)))
                    || ((utilService.certificationStatus(cp) !== 'Suspended by ONC' && utilService.certificationStatus(cp) !== 'Terminated by ONC') &&
                    vm.isDeveloperMergeable(vm.activeDeveloper));
            } else {
                return (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) && (vm.isDeveloperMergeable(vm.activeDeveloper) || vm.isDeveloperBanned(vm.activeDeveloper)))
                || vm.isDeveloperMergeable(vm.activeDeveloper);
            }
        }

        function isTransparencyAttestationViewable () {
            if (vm.isOn('effective-rule-date-plus-one-week')) {
                return !vm.hasAnyRole(['ROLE_ACB']);
            }
            return true;
        }

        function isTransparencyAttestationRemoved () {
            return vm.activeDeveloper.transparencyAttestations.reduce((acc, cur) => (cur.attestation ? cur.attestation.removed : false) || acc, false);
        }

        function searchForSurveillance () {
            var query = {
                pageNumber: 0,
                pageSize: '50',
                searchTerm: vm.surveillanceSearch.query,
            };
            vm.surveillanceProduct = null;
            vm.surveillanceSearch.results = null;
            networkService.search(query)
                .then(function (response) {
                    vm.surveillanceSearch.results = response.results;
                    if (vm.surveillanceSearch.results.length === 1) {
                        vm.productId = vm.surveillanceSearch.results[0].id;
                        vm.loadSurveillance();
                    }
                });
        }

        function doWork (workType) {
            if (vm.workType !== workType) {
                vm.activeDeveloper = '';
                vm.activeProduct = '';
                vm.activeVersion = '';
                vm.activeCP = '';
                vm.mergeType = 'developer';
                vm.workType = workType;
            }
        }

        function loadCp () {
            networkService.getListing(vm.productId, vm.forceRefresh)
                .then(function (result) {
                    for (var i = 0; i < vm.developers.length; i++) {
                        if (result.developer.developerId === vm.developers[i].developerId) {
                            vm.developerSelect = vm.developers[i];
                            break;
                        }
                    }
                    vm.activeDeveloper = vm.developerSelect;
                    networkService.getProductsByDeveloper(vm.activeDeveloper.developerId)
                        .then(function (products) {
                            vm.products = products.products;
                            for (var i = 0; i < vm.products.length; i++) {
                                if (result.product.productId === vm.products[i].productId) {
                                    vm.productSelect = vm.products[i];
                                    break;
                                }
                            }
                            vm.activeProduct = vm.productSelect;
                            vm.activeProduct.developerId = vm.activeDeveloper.developerId;
                            networkService.getVersionsByProduct(vm.activeProduct.productId)
                                .then(function (versions) {
                                    vm.versions = versions;
                                    for (var i = 0; i < vm.versions.length; i++) {
                                        if (result.version.versionId === vm.versions[i].versionId) {
                                            vm.versionSelect = vm.versions[i];
                                            break;
                                        }
                                    }
                                    vm.activeVersion = vm.versionSelect;
                                    vm.activeVersion.productId = vm.activeProduct.productId;
                                    networkService.getProductsByVersion(vm.activeVersion.versionId, true)
                                        .then(function (cps) {
                                            vm.cps = cps;
                                            vm.cpSelect = result.id;
                                            vm.selectCp();
                                        });
                                });
                        });
                });
        }

        function loadSurveillance () {
            networkService.getListing(vm.productId, vm.forceRefresh)
                .then(function (result) {
                    vm.surveillanceProduct = result;
                });
        }

        function splitDeveloper () {
            vm.splitDeveloperModalInstance = $uibModal.open({
                component: 'aiDeveloperSplit',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    developer: () => vm.activeDeveloper,
                    products: () => vm.products,
                },
            });
            vm.splitDeveloperModalInstance.result.then(() => {
                vm.forceRefresh = true;
                refreshDevelopers();
                if (!isEditingListing()) {
                    vm.developerSelect = '';
                    vm.activeDeveloper = '';
                    vm.activeProduct = '';
                    vm.activeVersion = '';
                    vm.activeCP = '';
                }
            }, result => {
                if (result !== 'cancelled') {
                    $log.info('dismissed', result);
                }
            });
        }

        function splitProduct () {
            vm.splitProductInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/certifiedProduct/product/split.html',
                controller: 'SplitProductController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    product: function () { return vm.activeProduct; },
                    versions: function () { return vm.versions; },
                },
            });
            vm.splitProductInstance.result.then(function (result) {
                if (isEditingListing()) {
                    vm.forceRefresh = true;
                    refreshDevelopers()
                } else {
                    vm.activeProduct = result.product;
                    vm.activeVersion = '';
                    vm.products.push(result.newProduct);
                    vm.versions = result.versions;
                }
            }, function (result) {
                if (result !== 'cancelled') {
                    vm.productMessage = result;
                } else {
                    $log.info('split cancelled');
                }
            });
        }

        ////////////////////////////////////////////////////////////////////

        function getResources () {
            vm.resourcesReady = {
                searchOptions: false,
                atls: false,
                qmsStandards: false,
                accessibilityStandards: false,
                ucdProcesses: false,
                testProcedures: false,
                testData: false,
                testStandards: false,
                testFunctionality: false,
                testTools: false,
                targetedUsers: false,
            };

            networkService.getSearchOptions()
                .then(function (options) {
                    vm.resources.bodies = options.acbs;
                    vm.resources.classifications = options.productClassifications;
                    vm.resources.editions = options.editions;
                    vm.resources.practices = options.practiceTypes;
                    vm.resources.statuses = options.certificationStatuses;
                    vm.resourcesReady.searchOptions = true;
                });

            networkService.getAtls(false)
                .then(function (data) {
                    vm.resources.testingLabs = data.atls;
                    vm.resourcesReady.atls = true;
                });

            networkService.getQmsStandards()
                .then(function (response) {
                    vm.resources.qmsStandards = response;
                    vm.resourcesReady.qmsStandards = true;
                });

            networkService.getAccessibilityStandards()
                .then(function (response) {
                    vm.resources.accessibilityStandards = response;
                    vm.resourcesReady.accessibilityStandards = true;
                });

            networkService.getUcdProcesses()
                .then(function (response) {
                    vm.resources.ucdProcesses = response;
                    vm.resourcesReady.ucdProcesses = true;
                });

            networkService.getTestProcedures()
                .then(function (response) {
                    vm.resources.testProcedures = response;
                    vm.resourcesReady.testProcedures = true;
                });

            networkService.getTestData()
                .then(function (response) {
                    vm.resources.testData = response;
                    vm.resourcesReady.testData = true;
                });

            networkService.getTestStandards()
                .then(function (response) {
                    vm.resources.testStandards = response;
                    vm.resourcesReady.testStandards = true;
                });

            networkService.getTestFunctionality()
                .then(function (response) {
                    vm.resources.testFunctionalities = response;
                    vm.resourcesReady.testFunctionality = true;
                });

            networkService.getTestTools()
                .then(function (response) {
                    vm.resources.testTools = response;
                    vm.resourcesReady.testTools = true;
                });

            networkService.getTargetedUsers()
                .then(function (response) {
                    vm.resources.targetedUsers = response;
                    vm.resourcesReady.targetedUsers = true;
                });
        }

        function isEditingListing () {
            if (vm.productId) {
                return true;
            } else {
                return false;
            }
        }

        function prepCodes () {
            var values = {};
            for (var i = 0; i < vm.developers.length; i++) {
                vm.developers[i].transMap = {};
                for (var j = 0; j < vm.developers[i].transparencyAttestations.length; j++) {
                    vm.developers[i].transMap[vm.developers[i].transparencyAttestations[j].acbName] = vm.developers[i].transparencyAttestations[j].attestation;
                    values[vm.developers[i].transparencyAttestations[j].acbName] = true;
                }
            }
            vm.activeAcbs = [];
            angular.forEach(values, function (value, key) {
                vm.activeAcbs.push(key);
            });
        }
    }
})();
