(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('VpManagementController', VpManagementController)
        .directive('aiVpManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'app/admin/components/certifiedProduct/management.html',
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
    function VpManagementController ($log, $uibModal, API, FileUploader, authService, commonService) {
        var vm = this;

        vm.doWork = doWork;
        vm.editCertifiedProduct = editCertifiedProduct;
        vm.editDeveloper = editDeveloper;
        vm.editProduct = editProduct;
        vm.editVersion = editVersion;
        vm.getNumberOfListingsToReject = getNumberOfListingsToReject;
        vm.getNumberOfSurveillanceToReject = getNumberOfSurveillanceToReject;
        vm.inspectCp = inspectCp;
        vm.inspectSurveillance = inspectSurveillance;
        vm.isDeveloperEditable = isDeveloperEditable;
        vm.isDeveloperMergeable = isDeveloperMergeable;
        vm.isProductEditable = isProductEditable;
        vm.loadCp = loadCp;
        vm.loadSurveillance = loadSurveillance;
        vm.massRejectPendingListings = massRejectPendingListings;
        vm.massRejectPendingSurveillance = massRejectPendingSurveillance;
        vm.mergeDevelopers = mergeDevelopers;
        vm.mergeProducts = mergeProducts;
        vm.mergeVersions = mergeVersions;
        vm.parseUploadError = parseUploadError;
        vm.parseSurveillanceUploadError = parseSurveillanceUploadError;
        vm.refreshDevelopers = refreshDevelopers;
        vm.refreshPending = refreshPending;
        vm.rejectCp = rejectCp;
        vm.rejectSurveillance = rejectSurveillance;
        vm.searchForSurveillance = searchForSurveillance;
        vm.selectCp = selectCp;
        vm.selectDeveloper = selectDeveloper;
        vm.selectProduct = selectProduct;
        vm.selectVersion = selectVersion;
        vm.splitProduct = splitProduct;
        vm.ternaryFilter = ternaryFilter;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.activeDeveloper = '';
            vm.activeProduct = '';
            vm.activeVersion = '';
            vm.activeCP = '';
            vm.isChplAdmin = authService.isChplAdmin();
            vm.isAcbAdmin = authService.isAcbAdmin();
            vm.isAcbStaff = authService.isAcbStaff();
            vm.uploadingCps = [];
            vm.uploadingSurveillances = [];
            if (angular.isUndefined(vm.workType)) {
                vm.workType = 'manage';
            }
            vm.mergeType = 'developer';
            vm.uploadMessage = '';
            vm.uploadErrors = [];
            vm.uploadSuccess = true;
            vm.surveillanceUploadMessage = '';
            vm.surveillanceUploadErrors = [];
            vm.surveillanceUploadSuccess = true;
            vm.resources = {};
            vm.refreshDevelopers();

            if (vm.isAcbAdmin || vm.isAcbStaff) {
                vm.refreshPending();
                vm.uploader = new FileUploader({
                    url: API + '/certified_products/upload',
                    removeAfterUpload: true,
                    headers: {
                        Authorization: 'Bearer ' + authService.getToken(),
                        'API-Key': authService.getApiKey(),
                    },
                });
                if (angular.isUndefined(vm.uploader.filters)) {
                    vm.uploader.filters = [];
                }
                vm.uploader.filters.push({
                    name: 'csvFilter',
                    fn: function (item) {
                        var extension = '|' + item.name.slice(item.name.lastIndexOf('.') + 1) + '|';
                        return '|csv|'.indexOf(extension) !== -1;
                    },
                });
                vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    $log.info('onSuccessItem', fileItem, response, status, headers);
                    vm.uploadMessage = 'File "' + fileItem.file.name + '" was uploaded successfully. ' + response.pendingCertifiedProducts.length + ' pending products are ready for confirmation.';
                    vm.uploadErrors = [];
                    vm.uploadSuccess = true;
                };
                vm.uploader.onCompleteItem = function (fileItem, response, status, headers) {
                    $log.info('onCompleteItem', fileItem, response, status, headers);
                    vm.refreshPending();
                };
                vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
                    $log.info('onErrorItem', fileItem, response, status, headers);
                    vm.uploadMessage = 'File "' + fileItem.file.name + '" was not uploaded successfully.';
                    vm.uploadErrors = response.errorMessages;
                    vm.uploadSuccess = false;
                };
                vm.uploader.onCancelItem = function (fileItem, response, status, headers) {
                    $log.info('onCancelItem', fileItem, response, status, headers);
                };

                vm.surveillanceUploader = new FileUploader({
                    url: API + '/surveillance/upload',
                    removeAfterUpload: true,
                    headers: {
                        Authorization: 'Bearer ' + authService.getToken(),
                        'API-Key': authService.getApiKey(),
                    },
                });
                if (angular.isUndefined(vm.surveillanceUploader.filters)) {
                    vm.surveillanceUploader.filters = [];
                }
                vm.surveillanceUploader.filters.push({
                    name: 'csvFilter',
                    fn: function (item) { //, options) {
                        var extension = '|' + item.name.slice(item.name.lastIndexOf('.') + 1) + '|';
                        return '|csv|'.indexOf(extension) !== -1;
                    },
                });
                vm.surveillanceUploader.onSuccessItem = function (fileItem, response, status, headers) {
                    $log.info('onSuccessItem', fileItem, response, status, headers);
                    vm.surveillanceUploadMessage = 'File "' + fileItem.file.name + '" was uploaded successfully. ' + response.pendingSurveillance.length + ' pending surveillance records are ready for confirmation.';
                    vm.surveillanceUploadErrors = [];
                    vm.surveillanceUploadSuccess = true;
                };
                vm.surveillanceUploader.onCompleteItem = function (fileItem, response, status, headers) {
                    $log.info('onCompleteItem', fileItem, response, status, headers);
                    vm.refreshPending();
                };
                vm.surveillanceUploader.onErrorItem = function (fileItem, response, status, headers) {
                    $log.info('onErrorItem', fileItem, response, status, headers);
                    vm.surveillanceUploadMessage = 'File "' + fileItem.file.name + '" was not uploaded successfully.';
                    vm.surveillanceUploadErrors = response.errorMessages;
                    vm.surveillanceUploadSuccess = false;
                };
                vm.surveillanceUploader.onCancelItem = function (fileItem, response, status, headers) {
                    $log.info('onCancelItem', fileItem, response, status, headers);
                };
            }

            getResources();
        }

        function refreshDevelopers () {
            commonService.getDevelopers()
                .then(function (developers) {
                    vm.developers = developers.developers;
                    prepCodes();

                    if (vm.productId && vm.workType === 'manage') {
                        vm.loadCp();
                    } else if (vm.productId && vm.workType === 'manageSurveillance') {
                        vm.loadSurveillance();
                    }
                });
        }

        function refreshPending () {
            commonService.getUploadingCps()
                .then(function (cps) {
                    vm.uploadingCps = [].concat(cps.pendingCertifiedProducts);
                    vm.pendingProducts = vm.uploadingCps.length;
                })
            commonService.getUploadingSurveillances()
                .then(function (surveillances) {
                    vm.uploadingSurveillances = [].concat(surveillances.pendingSurveillance);
                    vm.pendingSurveillances = vm.uploadingSurveillances.length;
                })
        }

        function selectDeveloper () {
            if (vm.developerSelect) {
                vm.activeDeveloper = vm.developerSelect;
                commonService.getProductsByDeveloper(vm.activeDeveloper.developerId)
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
                templateUrl: 'app/admin/components/certifiedProduct/developer/edit.html',
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
                vm.activeDeveloper = result;
                commonService.getDevelopers()
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

        function massRejectPendingListings () {
            var idsToReject = [];
            angular.forEach(vm.massReject, function (value, key) {
                if (value) {
                    idsToReject.push(parseInt(key));
                }
            });
            commonService.massRejectPendingListings(idsToReject)
                .then(function () {
                    angular.forEach(vm.massReject, function (value, key) {
                        if (value) {
                            clearPendingListing(parseInt(key));
                            delete(vm.massReject[key]);
                        }
                    });
                }, function (error) {
                    angular.forEach(vm.massReject, function (value, key) {
                        if (value) {
                            clearPendingListing(parseInt(key));
                            delete(vm.massReject[key]);
                        }
                    });
                    if (error.data.errors && error.data.errors.length > 0) {
                        vm.uploadingListingsMessages = error.data.errors.map(function (error) {
                            var ret = 'Product with ID: "' + error.objectId + '" has already been resolved by "' + error.contact.firstName + ' ' + error.contact.lastName + '"';
                            return ret;
                        });
                    }
                });
        }

        function massRejectPendingSurveillance () {
            var idsToReject = [];
            angular.forEach(vm.massRejectSurveillance, function (value, key) {
                if (value) {
                    idsToReject.push(parseInt(key));
                }
            });
            commonService.massRejectPendingSurveillance(idsToReject)
                .then(function () {
                    angular.forEach(vm.massRejectSurveillance, function (value, key) {
                        if (value) {
                            clearPendingSurveillance(parseInt(key));
                            delete(vm.massRejectSurveillance[key]);
                        }
                    });
                }, function (error) {
                    angular.forEach(vm.massRejectSurveillance, function (value, key) {
                        if (value) {
                            clearPendingSurveillance(parseInt(key));
                            delete(vm.massRejectSurveillance[key]);
                        }
                    });
                    if (error.data.errors && error.data.errors.length > 0) {
                        vm.uploadingSurveillanceMessages = error.data.errors.map(function (error) {
                            var ret = 'Surveillance with ID: "' + error.objectId + '" has already been resolved by "' + error.contact.firstName + ' ' + error.contact.lastName + '"';
                            return ret;
                        });
                    }
                });
        }

        function mergeDevelopers () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/certifiedProduct/developer/merge.html',
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
                commonService.getDevelopers()
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
                commonService.getVersionsByProduct(vm.activeProduct.productId)
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
                templateUrl: 'app/admin/components/certifiedProduct/product/edit.html',
                controller: 'EditProductController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    activeProduct: function () { return vm.activeProduct; },
                },
            });
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
                templateUrl: 'app/admin/components/certifiedProduct/product/merge.html',
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
                commonService.getProductsByDeveloper(vm.activeDeveloper.developerId)
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
                templateUrl: 'app/admin/components/certifiedProduct/version/merge.html',
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
                commonService.getVersionsByProduct(vm.activeProduct.productId)
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
                commonService.getProductsByVersion(vm.activeVersion.versionId, true)
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
                templateUrl: 'app/admin/components/certifiedProduct/version/edit.html',
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

        function getNumberOfListingsToReject () {
            var ret = 0;
            angular.forEach(vm.massReject, function (value) {
                if (value) {
                    ret += 1;
                }
            });
            return ret;
        }

        function getNumberOfSurveillanceToReject () {
            var ret = 0;
            angular.forEach(vm.massRejectSurveillance, function (value) {
                if (value) {
                    ret += 1;
                }
            });
            return ret;
        }

        function selectCp () {
            if (vm.cpSelect) {
                vm.activeCP = {};
                vm.activeCP.certifyingBody = {};
                vm.activeCP.practiceType = {};
                vm.activeCP.classificationType = {};
                commonService.getProduct(vm.cpSelect)
                    .then(function (cp) {
                        vm.activeCP = cp;
                        vm.activeCP.certDate = new Date(vm.activeCP.certificationDate);
                        commonService.getCap(vm.cpSelect)
                            .then(function (cap) {
                                vm.activeCP.cap = cap.plans;
                            });
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
                templateUrl: 'app/admin/components/certifiedProduct/listing/edit.html',
                controller: 'EditCertifiedProductController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    activeCP: function () { return vm.activeCP; },
                    isAcbAdmin: function () { return vm.isAcbAdmin; },
                    isAcbStaff: function () { return vm.isAcbStaff; },
                    isChplAdmin: function () { return vm.isChplAdmin; },
                    resources: function () { return resources; },
                    workType: function () { return vm.workType; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                vm.activeCP = result;
                getResources();
                vm.productId = result.id;
                vm.refreshDevelopers();
                //vm.loadCp();
            }, function (result) {
                if (result !== 'cancelled') {
                    vm.cpMessage = result;
                } else {
                    $log.info(result);
                }
            });
        }

        function inspectCp (cpId) {
            var cp;
            for (var i = 0; i < vm.uploadingCps.length; i++) {
                if (cpId === vm.uploadingCps[i].id) {
                    cp = vm.uploadingCps[i];
                }
            }

            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/certifiedProduct/listing/inspect.html',
                controller: 'InspectController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    developers: function () { return vm.developers; },
                    inspectingCp: function () { return cp; },
                    isAcbAdmin: function () { return vm.isAcbAdmin; },
                    isAcbStaff: function () { return vm.isAcbStaff; },
                    isChplAdmin: function () { return vm.isChplAdmin; },
                    resources: function () { return vm.resources; },
                    workType: function () { return vm.workType; },
                },
                size: 'lg',
            });
            vm.modalInstance.result.then(function (result) {
                if (result.status === 'confirmed' || result.status === 'rejected' || result.status === 'resolved') {
                    if (result.developerCreated) {
                        vm.developers.push(result.developer);
                    }
                    for (var i = 0; i < vm.uploadingCps.length; i++) {
                        if (cpId === vm.uploadingCps[i].id) {
                            vm.uploadingCps.splice(i,1)
                            vm.pendingProducts = vm.uploadingCps.length;
                        }
                    }
                    if (result.status === 'resolved') {
                        vm.uploadingListingsMessages = ['Product with ID: "' + result.objectId + '" has already been resolved by "' + result.contact.firstName + ' ' + result.contact.lastName + '"'];
                    }
                }
            }, function (result) {
                $log.info('inspection: ' + result);
            });
        }

        function inspectSurveillance (surv) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/surveillance/inspect.html',
                controller: 'SurveillanceInspectController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    surveillance: function () { return surv; },
                },
                size: 'lg',
            });
            vm.modalInstance.result.then(function () {
                vm.refreshPending();
            }, function (result) {
                if (result !== 'cancelled') {
                    vm.refreshPending();
                }
            });
        }

        function isDeveloperEditable (dev) {
            return vm.isChplAdmin || dev.status.status === 'Active';
        }

        function isDeveloperMergeable (dev) {
            return dev.status.status === 'Active';
        }

        function isProductEditable (cp) {
            if (cp.certificationStatus) {
                return (vm.isChplAdmin || (cp.certificationStatus.name !== 'Suspended by ONC' && cp.certificationStatus.name !== 'Terminated by ONC')) &&
                    vm.isDeveloperMergeable(vm.activeDeveloper);
            } else {
                return vm.isDeveloperMergeable(vm.activeDeveloper);
            }
        }

        function rejectCp (cpId) {
            commonService.rejectPendingCp(cpId)
                .then(function () {
                    clearPendingListing(cpId);
                }, function (error) {
                    vm.uploadingListingsMessages = error.data.errorMessages;
                });
        }

        function rejectSurveillance (survId) {
            commonService.rejectPendingSurveillance(survId)
                .then(function () {
                    clearPendingSurveillance(survId);
                }, function (error) {
                    vm.uploadingSurveillanceMessages = error.data.errorMessages;
                });
        }

        function searchForSurveillance () {
            var query = {
                pageNumber: 0,
                pageSize: '50',
                searchTerm: vm.surveillanceSearch.query,
            };
            vm.surveillanceProduct = null;
            vm.surveillanceSearch.results = null;
            commonService.search(query)
                .then(function (response) {
                    vm.surveillanceSearch.results = response.results;
                    if (vm.surveillanceSearch.results.length === 1) {
                        vm.productId = vm.surveillanceSearch.results[0].id;
                        vm.loadSurveillance();
                    }
                });
        }

        function parseUploadError (cp) {
            var ret = '';
            if (cp.recordStatus.toLowerCase() !== 'new') {
                ret = 'Existing Certified Product found';
            } else {
                if (cp.errorMessages.length > 0) {
                    ret += 'Errors:&nbsp;' + cp.errorMessages.length;
                }
                if (cp.warningMessages.length > 0) {
                    if (ret.length > 0) {
                        ret += '<br />';
                    }
                    ret += 'Warnings:&nbsp;' + cp.warningMessages.length;
                }
                if (ret.length === 0) {
                    ret = 'OK';

                }
            }
            return ret;
        }

        function parseSurveillanceUploadError (surv) {
            var ret = '';
            if (surv.errorMessages.length > 0) {
                ret += 'Errors:&nbsp;' + surv.errorMessages.length;
            }
            if (surv.warningMessages && surv.warningMessages.length > 0) {
                if (ret.length > 0) {
                    ret += '<br />';
                }
                ret += 'Warnings:&nbsp;' + surv.warningMessages.length;
            }
            if (ret.length === 0) {
                ret = 'OK';
            }
            return ret;
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
            commonService.getProduct(vm.productId)
                .then(function (result) {
                    for (var i = 0; i < vm.developers.length; i++) {
                        if (result.developer.developerId === vm.developers[i].developerId) {
                            vm.developerSelect = vm.developers[i];
                            break;
                        }
                    }
                    vm.activeDeveloper = vm.developerSelect;
                    commonService.getProductsByDeveloper(vm.activeDeveloper.developerId)
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
                            commonService.getVersionsByProduct(vm.activeProduct.productId)
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
                                    commonService.getProductsByVersion(vm.activeVersion.versionId, true)
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
            commonService.getProduct(vm.productId)
                .then(function (result) {
                    vm.surveillanceProduct = result;
                });
        }

        function splitProduct () {
            vm.splitProductInstance = $uibModal.open({
                templateUrl: 'app/admin/components/certifiedProduct/product/split.html',
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
                vm.activeProduct = result.product;
                vm.activeVersion = '';
                vm.products.push(result.newProduct);
                vm.versions = result.versions;
            }, function (result) {
                if (result !== 'cancelled') {
                    vm.productMessage = result;
                } else {
                    $log.info('split cancelled');
                }
            });
        }

        function ternaryFilter (field) {
            if (field === null) {
                return 'N/A';
            } else {
                return field ? 'True' : 'False';
            }
        }

        ////////////////////////////////////////////////////////////////////

        function clearPendingListing (cpId) {
            for (var i = 0; i < vm.uploadingCps.length; i++) {
                if (cpId === vm.uploadingCps[i].id) {
                    vm.uploadingCps.splice(i,1)
                    vm.pendingProducts = vm.uploadingCps.length;
                }
            }
        }

        function clearPendingSurveillance (survId) {
            for (var i = 0; i < vm.uploadingSurveillances.length; i++) {
                if (survId === vm.uploadingSurveillances[i].id) {
                    vm.uploadingSurveillances.splice(i,1)
                    vm.pendingSurveillances = vm.uploadingSurveillances.length;
                }
            }
        }

        function getResources () {
            commonService.getSearchOptions()
                .then(function (options) {
                    vm.resources.bodies = options.certBodyNames;
                    vm.resources.classifications = options.productClassifications;
                    vm.resources.editions = options.editions;
                    vm.resources.practices = options.practiceTypeNames;
                    vm.resources.statuses = options.certificationStatuses;
                });

            commonService.getAtls(false)
                .then(function (data) {
                    vm.resources.testingLabs = data.atls;
                });

            commonService.getQmsStandards()
                .then(function (response) {
                    vm.resources.qmsStandards = response;
                });

            commonService.getAccessibilityStandards()
                .then(function (response) {
                    vm.resources.accessibilityStandards = response;
                });

            commonService.getTestStandards()
                .then(function (response) {
                    vm.resources.testStandards = response;
                });

            commonService.getUcdProcesses()
                .then(function (response) {
                    vm.resources.ucdProcesses = response;
                });

            commonService.getTestFunctionality()
                .then(function (response) {
                    vm.resources.testFunctionalities = response;
                });

            commonService.getTestTools()
                .then(function (response) {
                    vm.resources.testTools = response;
                });

            commonService.getTargetedUsers()
                .then(function (response) {
                    vm.resources.targetedUsers = response;
                });
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
