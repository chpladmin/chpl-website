;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('VpManagementController', ['commonService', 'authService', '$log', 'FileUploader', 'API', '$modal', function (commonService, authService, $log, FileUploader, API, $modal) {
            var self = this;
            self.activeVendor = '';
            self.activeProduct = '';
            self.activeVersion = '';
            self.activeCP = '';
            self.isChplAdmin = authService.isChplAdmin();
            self.isAcbAdmin = authService.isAcbAdmin();
            self.uploadingCps = [];
            self.inspectingCp = '';
            self.workType = self.isChplAdmin ? 'manage' : 'upload';
            self.uploadMessage = '';

            self.activate = activate;
            self.refreshPending = refreshPending;
            self.selectVendor = selectVendor;
            self.editDeveloper = editDeveloper;
            self.mergeDevelopers = mergeDevelopers;
            self.selectProduct = selectProduct;
            self.editProduct = editProduct;
            self.mergeProducts = mergeProducts;
            self.selectVersion = selectVersion;
            self.editVersion = editVersion;
            self.mergeVersions = mergeVersions;
            self.selectCp = selectCp;
            self.editCertifiedProduct = editCertifiedProduct;
            self.parseUploadError = parseUploadError;
            self.doWork = doWork;

            self.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                if (self.isAcbAdmin) {
                    self.refreshPending();
                    self.uploader = new FileUploader({
                        url: API + '/certified_products/upload',
                        removeAfterUpload: true,
                        headers: { Authorization: 'Bearer ' + authService.getToken() }
                    });
                    self.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                        $log.info('onSuccessItem', fileItem, response, status, headers);
                        self.uploadMessage = 'File "' + fileItem.file.name + '" was uploaded successfully. Pending products are ready for confirmation.';
                    };
                    self.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                        self.refreshPending();
                    };
                    self.uploader.onErrorItem = function(fileItem, response, status, headers) {
                        $log.info('onErrorItem', fileItem, response, status, headers);
                    };
                    self.uploader.onCancelItem = function(fileItem, response, status, headers) {
                        $log.info('onCancelItem', fileItem, response, status, headers);
                    };
                }

                commonService.getVendors()
                    .then(function (vendors) {
                        self.vendors = vendors.vendors;
                    });
            }

            function refreshPending () {
                commonService.getUploadingCps()
                    .then(function (cps) {
                        self.uploadingCps = [].concat(cps.pendingCertifiedProducts);
                    })
            }

            function selectVendor () {
                if (self.vendorSelect) {
                    self.activeVendor = self.vendorSelect;
                    commonService.getProductsByVendor(self.activeVendor.vendorId)
                        .then(function (products) {
                            self.products = products.products;
                        });
                    self.mergeVendor = angular.copy(self.activeVendor);
                    delete self.mergeVendor.vendorId;
                    delete self.mergeVendor.lastModifiedDate;
                }
            }

            function editDeveloper () {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/vpEditDeveloper.html',
                    controller: 'EditDeveloperController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        activeVendor: function () { return self.activeVendor; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.activeVendor = result;
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.vendorMessage = result;
                    }
                });
            }

            function mergeDevelopers () {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/vpMergeDeveloper.html',
                    controller: 'MergeDeveloperController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        developers: function () { return self.mergingVendors; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.vendorMessage = null;
                    commonService.getVendors()
                        .then(function (vendors) {
                            self.vendors = vendors.vendors;
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.vendorMessage = result;
                    }
                });
            }

            function selectProduct () {
                if (self.productSelect) {
                    self.activeProduct = self.productSelect;
                    self.activeProduct.vendorId = self.activeVendor.vendorId;
                    commonService.getVersionsByProduct(self.activeProduct.productId)
                        .then(function (versions) {
                            self.versions = versions;
                        });
                    self.mergeProduct = angular.copy(self.activeProduct);
                    delete self.mergeProduct.productId;
                    delete self.mergeProduct.lastModifiedDate;
                }
            }

            function editProduct () {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/vpEditProduct.html',
                    controller: 'EditProductController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        activeProduct: function () { return self.activeProduct; },
                        vendors: function () { return self.vendors; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.activeProduct = result;
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.productMessage = result;
                    }
                });
            }

            function mergeProducts () {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/vpMergeProduct.html',
                    controller: 'MergeProductController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        products: function () { return self.mergingProducts; },
                        vendorId: function () { return self.activeVendor.vendorId; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.productMessage = null;
                    commonService.getProductsByVendor(self.activeVendor.vendorId)
                        .then(function (products) {
                            self.products = products.products;
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.productMessage = result;
                    }
                });
            }

            function mergeVersions () {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/vpMergeVersion.html',
                    controller: 'MergeVersionController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        versions: function () { return self.mergingVersions; },
                        productId: function () { return self.activeProduct.productId; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.productMessage = null;
                    commonService.getVersionsByProduct(self.activeProduct.productId)
                        .then(function (versions) {
                            self.versions = versions;
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.productMessage = result;
                    }
                });
            }

            function selectVersion () {
                if (self.versionSelect) {
                    self.activeVersion = self.versionSelect;
                    self.activeVersion.productId = self.activeProduct.productId;
                    commonService.getProductsByVersion(self.activeVersion.versionId)
                        .then(function (cps) {
                            self.cps = cps;
                        });
                    self.mergeVersion = angular.copy(self.activeVersion);
                    delete self.mergeVersion.versionId;
                    delete self.mergeVersion.lastModifiedDate;
                }
            }

            function editVersion () {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/vpEditVersion.html',
                    controller: 'EditVersionController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        activeVersion: function () { return self.activeVersion; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.activeVersion = result;
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.versionMessage = result;
                    }
                });
            }

            function selectCp () {
                if (self.cpSelect) {
                    self.activeCP = {};
                    self.activeCP.classificationType = {};
                    self.activeCP.certifyingBody = {};
                    self.activeCP.practiceType = {};
                    commonService.getProduct(self.cpSelect)
                        .then(function (cp) {
                            self.activeCP = cp;
                            if (self.activeCP.visibleOnChpl === undefined)
                                self.activeCP.visibleOnChpl = true;
                            self.activeCP.certDate = new Date(self.activeCP.certificationDate);
                        });
                }
            };

            function editCertifiedProduct () {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/vpEditCertifiedProduct.html',
                    controller: 'EditCertifiedProductController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        activeCP: function () { return self.activeCP; },
                        classifications: function () { return self.classifications; },
                        practices: function () { return self.practices; },
                        isAcbAdmin: function () { return self.isAcbAdmin; },
                        isChplAdmin: function () { return self.isChplAdmin; },
                        bodies: function () { return self.bodies; },
                        statuses: function () { return self.statuses; },
                        workType: function () { return self.workType; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    $log.debug(result.cqmResults);
                    self.activeCP = result;
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.cpMessage = result;
                    }
                });
            }

            self.populateData = function () {
                commonService.getSearchOptions()
                    .then(function (options) {
                        self.editions = options.editions;
                        self.classifications = options.productClassifications;
                        self.practices = options.practiceTypeNames;
                        self.bodies = options.certBodyNames;
                        self.statuses = options.certificationStatuses;
                    });
            };
            self.populateData();

            self.concatAddlSw = function (addlSw) {
                var retval = '';
                if (addlSw) {
                    for (var i = 0; i < addlSw.length; i++) {
                        retval += addlSw[i].name + ', ';
                    }
                    retval = retval.substring(0,retval.length - 2)
                }
                return retval;
            }

            self.inspectCp = function (cpId) {
                var cp;
                for (var i = 0; i < self.uploadingCps.length; i++) {
                    if (cpId === self.uploadingCps[i].id) {
                        cp = self.uploadingCps[i];
                    }
                }

                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/vpInspect.html',
                    controller: 'InspectController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        inspectingCp: function () { return cp; },
                        vendors: function () { return self.vendors; }
                    },
                    size: 'lg'
                });
                self.modalInstance.result.then(function (result) {
                    $log.info(result);
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });

/*
                self.activeVendor = angular.copy(cp.vendor);
                if (!self.activeVendor.id) {
                    self.activeVendor.address = angular.copy(cp.vendorAddress);
                } else {
                    delete self.activeVendor.website;
                }
                self.activeProduct = angular.copy(cp.product);
                self.activeVersion = angular.copy(cp.product);
                self.activeCP = angular.copy(cp);
                if (!cp.certificationStatus) {
                    for (var i = 0; i < self.statuses.length; i++) {
                        if (self.statuses[i].name === 'Pending') {
                            self.activeCP.certificationStatus = self.statuses[i];
                            break;
                        }
                    }
                }
                self.activeCP.certificationDate = new Date(parseInt(cp.certificationDate));
                self.activeCP.certDate = self.activeCP.certificationDate;

                if (!cp.product.versionId && cp.product.id) {
                    commonService.getVersionsByProduct(cp.product.id)
                        .then(function (versions) {
                            self.versions = versions;
                        });
                }
                if (!cp.product.id && cp.vendor.id) {
                    commonService.getProductsByVendor(cp.vendor.id)
                        .then(function (products) {
                            self.products = products.products;
                        });
                }
*/            };

            self.selectInspectingVendor = function () {
                self.activeVendor = self.vendorSelect;
                self.inspectingCp.vendor.id = self.activeVendor.vendorId;
                commonService.getProductsByVendor(self.activeVendor.vendorId)
                    .then(function (products) {
                        self.products = products.products;
                        for (var i = 0; i < self.products.length; i++) {
                            if (self.products[i].name === self.inspectingCp.product.name) {
                                self.inspectingCp.product.id = self.products[i].productId;
                                self.activeProduct = angular.copy(self.inspectingCp.product);
                                self.activeProduct.productId = self.inspectingCp.product.id;
                                commonService.getVersionsByProduct(self.activeProduct.productId)
                                    .then(function (versions) {
                                        self.versions = versions;
                                        for (var j = 0; j < self.versions.length; j++) {
                                            if (self.versions[j].version === self.inspectingCp.product.version) {
                                                self.inspectingCp.product.versionId = self.versions[j].versionId;
                                                self.activeVersion = angular.copy(self.inspectingCp.product);
                                                self.activeVersion.versionId = self.inspectingCp.product.versionId;
                                                break;
                                            }
                                        }
                                    });
                                break;
                            }
                        }
                    });
                self.activeVendor.id = self.activeVendor.vendorId;
            };

            self.selectInspectingProduct = function () {
                self.activeProduct = self.productSelect;
                commonService.getVersionsByProduct(self.activeProduct.productId)
                    .then(function (versions) {
                        self.versions = versions;
                        for (var j = 0; j < self.versions.length; j++) {
                            if (self.versions[j].version === self.inspectingCp.product.version) {
                                self.inspectingCp.product.versionId = self.versions[j].versionId;
                                self.activeVersion = angular.copy(self.inspectingCp.product);
                                self.activeVersion.versionId = self.inspectingCp.product.versionId;
                                break;
                            }
                        }
                    });
                self.activeProduct.id = self.activeProduct.productId;
            };

            self.selectInspectingVersion = function () {
                self.activeVersion = self.versionSelect;
                self.inspectingCp.product.versionId = self.activeVersion.versionId;
            };

            self.confirmCp = function (cpId) {
                $log.debug(self.inspectingCp);

                delete(self.inspectingCp.vendor.address);
                commonService.confirmPendingCp(self.inspectingCp)
                    .then(self.refreshPending);

                self.inspectingCp = '';
                self.cancelAll();
            };

            self.cancelInspectingCp = function () {
                self.inspectingCp = '';
                self.cancelAll();
            };

            self.rejectCp = function (cpId) {
                commonService.rejectPendingCp(cpId)
                    .then(self.refreshPending);

                self.inspectingCp = '';
                self.cancelAll();
            };

            self.cancelAll = function () {
                self.cancelVendor();
                self.cancelProduct();
                self.cancelVersion();
                self.cancelCP();
                self.mergeType = 'developer';
                self.uploadMessage = '';
            };

            self.cancelVendor = function () {
                self.activeVendor = '';
                self.vendorMessage = null;
                self.mergingVendors = [];
            };

            self.cancelProduct = function () {
                self.activeProduct = '';
                self.productMessage = null;
                //self.selectProduct();
                self.mergingProducts = [];
            };

            self.cancelVersion = function () {
                self.activeVersion = '';
                self.versionMessage = null;
                //self.selectVersion();
                self.mergingVersions = [];
            };

            self.cancelCP = function () {
                self.activeCP = '';
                self.cpMessage = null;
                self.selectCp();
            };

            function parseUploadError (cp) {
                var ret = '';
                if (cp.errorMessages.length > 0) {
                    ret += 'Errors:&nbsp;' + cp.errorMessages.length;
                }
                if (cp.warningMessages.length > 0) {
                    if (ret.length > 0)
                        ret += '<br />';
                    ret += 'Warnings:&nbsp;' + cp.warningMessages.length;
                }
                if (ret.length > 0) {
                    return ret;
                } else {
                    return 'OK';
                }
            }

            function doWork (workType) {
                self.cancelInspectingCp();
                self.workType = workType;
            }
        }]);

    angular.module('app.admin')
        .directive('aiVpManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/vpManagement.html',
                scope: {},
                controllerAs: 'vm',
                controller: 'VpManagementController'
            };
        });
})();
