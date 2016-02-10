;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('VpManagementController', ['commonService', 'authService', '$log', 'FileUploader', 'API', '$modal', function (commonService, authService, $log, FileUploader, API, $modal) {
            var self = this;

            self.activate = activate;
            self.refreshPending = refreshPending;
            self.selectDeveloper = selectDeveloper;
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
            self.inspectCp = inspectCp;
            self.rejectCp = rejectCp;
            self.parseUploadError = parseUploadError;
            self.doWork = doWork;
            self.loadCp = loadCp;

            self.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                self.activeDeveloper = '';
                self.activeProduct = '';
                self.activeVersion = '';
                self.activeCP = '';
                self.isChplAdmin = authService.isChplAdmin();
                self.isAcbAdmin = authService.isAcbAdmin();
                self.isAcbStaff = authService.isAcbStaff();
                self.uploadingCps = [];
                self.workType = self.productId ? 'manage' : self.isChplAdmin ? 'manage' : 'upload';
                self.mergeType = 'developer';
                self.uploadMessage = '';

                if (self.isAcbAdmin || self.isAcbStaff) {
                    self.refreshPending();
                    self.uploader = new FileUploader({
                        url: API + '/certified_products/upload',
                        removeAfterUpload: true,
                        headers: {
                            Authorization: 'Bearer ' + authService.getToken(),
                            'API-Key': authService.getApiKey()
                        }
                    });
                    self.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                        //$log.info('onSuccessItem', fileItem, response, status, headers);
                        self.uploadMessage = 'File "' + fileItem.file.name + '" was uploaded successfully. Pending products are ready for confirmation.';
                    };
                    self.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                        self.refreshPending();
                    };
                    self.uploader.onErrorItem = function(fileItem, response, status, headers) {
                        //$log.info('onErrorItem', fileItem, response, status, headers);
                    };
                    self.uploader.onCancelItem = function(fileItem, response, status, headers) {
                        //$log.info('onCancelItem', fileItem, response, status, headers);
                    };
                }

                commonService.getSearchOptions()
                    .then(function (options) {
                        self.editions = options.editions;
                        self.practices = options.practiceTypeNames;
                        self.bodies = options.certBodyNames;
                        self.statuses = options.certificationStatuses;
                    });

                commonService.getAtls(false)
                    .then(function (data) {
                        self.testingLabs = data.atls;
                    });

                commonService.getDevelopers()
                    .then(function (developers) {
                        self.developers = developers.developers;

                        if (self.productId) {
                            self.loadCp();
                        }
                    });
            }

            function refreshPending () {
                commonService.getUploadingCps()
                    .then(function (cps) {
                        self.uploadingCps = [].concat(cps.pendingCertifiedProducts);
                        self.pendingProducts = self.uploadingCps.length;
                    })
            }

            function selectDeveloper () {
                if (self.developerSelect) {
                    self.activeDeveloper = self.developerSelect;
                    commonService.getProductsByDeveloper(self.activeDeveloper.developerId)
                        .then(function (products) {
                            self.products = products.products;
                        });
                    self.mergeDeveloper = angular.copy(self.activeDeveloper);
                    delete self.mergeDeveloper.developerId;
                    delete self.mergeDeveloper.lastModifiedDate;
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
                        activeDeveloper: function () { return self.activeDeveloper; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.activeDeveloper = result;
                    commonService.getDevelopers()
                        .then(function (developers) {
                            self.developers = developers.developers;
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.developerMessage = result;
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
                        developers: function () { return self.mergingDevelopers; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.developerMessage = null;
                    commonService.getDevelopers()
                        .then(function (developers) {
                            self.developers = developers.developers;
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.developerMessage = result;
                    }
                });
            }

            function selectProduct () {
                if (self.productSelect) {
                    self.activeProduct = self.productSelect;
                    self.activeProduct.developerId = self.activeDeveloper.developerId;
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
                        developers: function () { return self.developers; }
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
                        developerId: function () { return self.activeDeveloper.developerId; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.productMessage = null;
                    commonService.getProductsByDeveloper(self.activeDeveloper.developerId)
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
                    commonService.getProductsByVersion(self.activeVersion.versionId, true)
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
                    self.activeCP.certifyingBody = {};
                    self.activeCP.practiceType = {};
                    commonService.getProduct(self.cpSelect)
                        .then(function (cp) {
                            self.activeCP = cp;
                            if (self.activeCP.visibleOnChpl === undefined)
                                self.activeCP.visibleOnChpl = true;
                            self.activeCP.certDate = new Date(self.activeCP.certificationDate);
                            commonService.getCap(self.cpSelect)
                                .then(function (cap) {
                                    self.activeCP.cap = cap.plans;
                                });
                            commonService.getSurveillance(self.cpSelect)
                                .then(function (surv) {
                                    self.activeCP.surveillances = surv.surveillances;
                                });
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
                        practices: function () { return self.practices; },
                        isAcbAdmin: function () { return self.isAcbAdmin; },
                        isAcbStaff: function () { return self.isChplStaff; },
                        isChplAdmin: function () { return self.isChplAdmin; },
                        bodies: function () { return self.bodies; },
                        testingLabs: function () { return self.testingLabs; },
                        statuses: function () { return self.statuses; },
                        workType: function () { return self.workType; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.activeCP = result;
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.cpMessage = result;
                    }
                });
            }

            function inspectCp (cpId) {
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
                        developers: function () { return self.developers; },
                        practices: function () { return self.practices; },
                        isAcbAdmin: function () { return self.isAcbAdmin; },
                        isAcbStaff: function () { return self.isAcbStaff; },
                        isChplAdmin: function () { return self.isChplAdmin; },
                        bodies: function () { return self.bodies; },
                        testingLabs: function () { return self.testingLabs; },
                        statuses: function () { return self.statuses; },
                        workType: function () { return self.workType; }
                    },
                    size: 'lg'
                });
                self.modalInstance.result.then(function (result) {
                    self.refreshPending();
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.refreshPending();
                    }
                });
            }

            function rejectCp  (cpId) {
                commonService.rejectPendingCp(cpId)
                    .then(self.refreshPending);
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
                        if (ret.length > 0)
                            ret += '<br />';
                        ret += 'Warnings:&nbsp;' + cp.warningMessages.length;
                    }
                    if (ret.length === 0) {
                        ret = 'OK';

                    }
                }
                return ret;
            }

            function doWork (workType) {
                if (self.workType !== workType) {
                    self.activeDeveloper = '';
                    self.activeProduct = '';
                    self.activeVersion = '';
                    self.activeCP = '';
                    self.mergeType = 'developer';
                    self.workType = workType;
                }
            }

            function loadCp () {
                commonService.getProduct(self.productId)
                    .then(function (result) {
                        for (var i = 0; i < self.developers.length; i++) {
                            if (result.developer.id === self.developers[i].developerId) {
                                self.developerSelect = self.developers[i];
                                break;
                            }
                        }
                        self.activeDeveloper = self.developerSelect;
                        commonService.getProductsByDeveloper(self.activeDeveloper.developerId)
                            .then(function (products) {
                                self.products = products.products;
                                for (var i = 0; i < self.products.length; i++) {
                                    if (result.product.id === self.products[i].productId) {
                                        self.productSelect = self.products[i];
                                        break;
                                    }
                                }
                                self.activeProduct = self.productSelect;
                                self.activeProduct.developerId = self.activeDeveloper.developerId;
                                commonService.getVersionsByProduct(self.activeProduct.productId)
                                    .then(function (versions) {
                                        self.versions = versions;
                                        for (var i = 0; i < self.versions.length; i++) {
                                            if (result.product.versionId === self.versions[i].versionId) {
                                                self.versionSelect = self.versions[i];
                                                break;
                                            }
                                        }
                                        self.activeVersion = self.versionSelect;
                                        self.activeVersion.productId = self.activeProduct.productId;
                                        commonService.getProductsByVersion(self.activeVersion.versionId, true)
                                            .then(function (cps) {
                                                self.cps = cps;
                                                self.cpSelect = result.id;
                                                self.selectCp();
                                            });
                                    });
                            });
                    });
            }
        }]);

    angular.module('app.admin')
        .directive('aiVpManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/vpManagement.html',
                bindToController: {
                    workType: '=',
                    pendingProducts: '=',
                    productId: '='
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'VpManagementController'
            };
        });
})();
