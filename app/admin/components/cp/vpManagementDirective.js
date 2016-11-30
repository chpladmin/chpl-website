;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('VpManagementController', ['commonService', 'authService', '$log', 'FileUploader', 'API', '$modal', function (commonService, authService, $log, FileUploader, API, $modal) {
            var self = this;

            self.activate = activate;
            self.doWork = doWork;
            self.editCertifiedProduct = editCertifiedProduct;
            self.editDeveloper = editDeveloper;
            self.editProduct = editProduct;
            self.editVersion = editVersion;
            self.inspectCp = inspectCp;
            self.inspectSurveillance = inspectSurveillance;
            self.isDeveloperEditable = isDeveloperEditable;
            self.isDeveloperMergeable = isDeveloperMergeable;
            self.loadCp = loadCp;
            self.loadSurveillance = loadSurveillance;
            self.mergeDevelopers = mergeDevelopers;
            self.mergeProducts = mergeProducts;
            self.mergeVersions = mergeVersions;
            self.parseUploadError = parseUploadError;
            self.parseSurveillanceUploadError = parseSurveillanceUploadError;
            self.refreshPending = refreshPending;
            self.rejectCp = rejectCp;
            self.rejectSurveillance = rejectSurveillance;
            self.searchForSurveillance = searchForSurveillance;
            self.selectCp = selectCp;
            self.selectDeveloper = selectDeveloper;
            self.selectProduct = selectProduct;
            self.selectVersion = selectVersion;
            self.ternaryFilter = ternaryFilter;

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
                self.uploadingSurveillances = [];
                if (angular.isUndefined(self.workType)) self.workType = 'manage';//self.workType = self.productId ? 'manage' : self.isChplAdmin ? 'manage' : 'upload';
                self.mergeType = 'developer';
                self.uploadMessage = '';
                self.uploadErrors = [];
                self.uploadSuccess = true;
                self.surveillanceUploadMessage = '';
                self.surveillanceUploadErrors = [];
                self.surveillanceUploadSuccess = true;
                self.resources = {};

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
                    if (angular.isUndefined(self.uploader.filters)) {
                        self.uploader.filters = [];
                    }
                    self.uploader.filters.push({
                        name: 'csvFilter',
                        fn: function(item, options) {
                            var extension = '|' + item.name.slice(item.name.lastIndexOf('.') + 1) + '|';
                            return '|csv|'.indexOf(extension) !== -1;
                        }
                    });
                    self.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                        //$log.info('onSuccessItem', fileItem, response, status, headers);
                        self.uploadMessage = 'File "' + fileItem.file.name + '" was uploaded successfully. ' + response.pendingCertifiedProducts.length + ' pending products are ready for confirmation.';
                        self.uploadErrors = [];
                        self.uploadSuccess = true;
                    };
                    self.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                        self.refreshPending();
                    };
                    self.uploader.onErrorItem = function(fileItem, response, status, headers) {
                        self.uploadMessage = 'File "' + fileItem.file.name + '" was not uploaded successfully.';
                        self.uploadErrors = response.errorMessages;
                        self.uploadSuccess = false;
                    };
                    self.uploader.onCancelItem = function(fileItem, response, status, headers) {
                        //$log.info('onCancelItem', fileItem, response, status, headers);
                    };

                    self.surveillanceUploader = new FileUploader({
                        url: API + '/surveillance/upload',
                        removeAfterUpload: true,
                        headers: {
                            Authorization: 'Bearer ' + authService.getToken(),
                            'API-Key': authService.getApiKey()
                        }
                    });
                    if (angular.isUndefined(self.surveillanceUploader.filters)) {
                        self.surveillanceUploader.filters = [];
                    }
                    self.surveillanceUploader.filters.push({
                        name: 'csvFilter',
                        fn: function(item, options) {
                            var extension = '|' + item.name.slice(item.name.lastIndexOf('.') + 1) + '|';
                            return '|csv|'.indexOf(extension) !== -1;
                        }
                    });
                    self.surveillanceUploader.onSuccessItem = function(fileItem, response, status, headers) {
                        //$log.info('onSuccessItem', fileItem, response, status, headers);
                        self.surveillanceUploadMessage = 'File "' + fileItem.file.name + '" was uploaded successfully. ' + response.pendingSurveillance.length + ' pending surveillance records are ready for confirmation.';
                        self.surveillanceUploadErrors = [];
                        self.surveillanceUploadSuccess = true;
                    };
                    self.surveillanceUploader.onCompleteItem = function(fileItem, response, status, headers) {
                        self.refreshPending();
                    };
                    self.surveillanceUploader.onErrorItem = function(fileItem, response, status, headers) {
                        self.surveillanceUploadMessage = 'File "' + fileItem.file.name + '" was not uploaded successfully.';
                        self.surveillanceUploadErrors = response.errorMessages;
                        self.surveillanceUploadSuccess = false;
                    };
                    self.surveillanceUploader.onCancelItem = function(fileItem, response, status, headers) {
                        //$log.info('onCancelItem', fileItem, response, status, headers);
                    };
                }

                commonService.getDevelopers()
                    .then(function (developers) {
                        self.developers = developers.developers;
                        prepCodes();

                        if (self.productId && self.workType === 'manage') {
                            self.loadCp();
                        } else if (self.productId && self.workType === 'manageSurveillance') {
                            self.loadSurveillance();
                        }
                    });

                getResources();
            }

            function refreshPending () {
                commonService.getUploadingCps ()
                    .then(function (cps) {
                        self.uploadingCps = [].concat(cps.pendingCertifiedProducts);
                        self.pendingProducts = self.uploadingCps.length;
                    })
                commonService.getUploadingSurveillances ()
                    .then(function (surveillances) {
                        self.uploadingSurveillances = [].concat(surveillances.pendingSurveillance);
                        self.pendingSurveillances = self.uploadingSurveillances.length;
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
                    templateUrl: 'admin/components/cp/vpEditDeveloper.html',
                    controller: 'EditDeveloperController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        activeDeveloper: function () { return self.activeDeveloper; },
                        activeAcbs: function () { return self.activeAcbs; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.activeDeveloper = result;
                    commonService.getDevelopers()
                        .then(function (developers) {
                            self.developers = developers.developers;
                            prepCodes();
                        });
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.developerMessage = result;
                    }
                });
            }

            function mergeDevelopers () {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/cp/vpMergeDeveloper.html',
                    controller: 'MergeDeveloperController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        developers: function () { return self.mergingDevelopers; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.developerMessage = null;
                    commonService.getDevelopers()
                        .then(function (developers) {
                            self.developers = developers.developers;
                            prepCodes();
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
                    templateUrl: 'admin/components/cp/vpEditProduct.html',
                    controller: 'EditProductController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        activeProduct: function () { return self.activeProduct; }
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
                    templateUrl: 'admin/components/cp/vpMergeProduct.html',
                    controller: 'MergeProductController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
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
                    templateUrl: 'admin/components/cp/vpMergeVersion.html',
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
                    templateUrl: 'admin/components/cp/vpEditVersion.html',
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
                    self.activeCP.classificationType = {};
                    commonService.getProduct(self.cpSelect)
                        .then(function (cp) {
                            self.activeCP = cp;
                            self.activeCP.certDate = new Date(self.activeCP.certificationDate);
                            commonService.getCap(self.cpSelect)
                                .then(function (cap) {
                                    self.activeCP.cap = cap.plans;
                                });
                        });
                }
            };

            function editCertifiedProduct () {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/cp/vpEditCertifiedProduct.html',
                    controller: 'EditCertifiedProductController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        activeCP: function () { return self.activeCP; },
                        isAcbAdmin: function () { return self.isAcbAdmin; },
                        isAcbStaff: function () { return self.isChplStaff; },
                        isChplAdmin: function () { return self.isChplAdmin; },
                        resources: function () { return self.resources; },
                        workType: function () { return self.workType; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.activeCP = result;
                    getResources();
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
                    templateUrl: 'admin/components/cp/vpInspect.html',
                    controller: 'InspectController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        developers: function () { return self.developers; },
                        inspectingCp: function () { return cp; },
                        isAcbAdmin: function () { return self.isAcbAdmin; },
                        isAcbStaff: function () { return self.isAcbStaff; },
                        isChplAdmin: function () { return self.isChplAdmin; },
                        resources: function () { return self.resources; },
                        workType: function () { return self.workType; }
                    },
                    size: 'lg'
                });
                self.modalInstance.result.then(function (result) {
                    if (result.developerCreated) {
                        self.developers.push(result.developer);
                    }
                    for (var i = 0; i < self.uploadingCps.length; i++) {
                        if (cpId === self.uploadingCps[i].id) {
                            self.uploadingCps.splice(i,1)
                            self.pendingProducts = self.uploadingCps.length;
                        }
                    }
                }, function (result) {
                    if (result !== 'cancelled') {
                        if (result.developerCreated) {
                            self.developers.push(result.developer);
                        }
                        for (var i = 0; i < self.uploadingCps.length; i++) {
                            if (cpId === self.uploadingCps[i].id) {
                                self.uploadingCps.splice(i,1)
                                self.pendingProducts = self.uploadingCps.length;
                            }
                        }
                    }
                });
            }

            function inspectSurveillance (surv) {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/surveillance/surveillanceInspect.html',
                    controller: 'SurveillanceInspectController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        surveillance: function () { return surv; }
                    },
                    size: 'lg'
                });
                self.modalInstance.result.then(function () {
                    self.refreshPending();
                }, function (result) {
                    if (result !== 'cancelled') {
                        self.refreshPending();
                    }
                });
            }

            function isDeveloperEditable (dev) {
                return self.isChplAdmin || dev.status.status === 'Active';
            }

            function isDeveloperMergeable (dev) {
                return dev.status.status === 'Active';
            }

            function rejectCp (cpId) {
                commonService.rejectPendingCp(cpId)
                    .then(self.refreshPending);
            }

            function rejectSurveillance (survId) {
                commonService.rejectPendingSurveillance(survId)
                    .then(self.refreshPending);
            }

            function searchForSurveillance () {
                var query = {
                    pageNumber: 0,
                    pageSize: '50',
                    searchTerm: self.surveillanceSearch.query
                };
                commonService.search(query)
                    .then(function (response) {
                        self.surveillanceSearch.results = response.results;
                        if (self.surveillanceSearch.results.length === 1) {
                            self.productId = self.surveillanceSearch.results[0].id;
                            self.loadSurveillance();
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

            function parseSurveillanceUploadError (surv) {
                var ret = '';
                if (surv.errorMessages.length > 0) {
                    ret += 'Errors:&nbsp;' + surv.errorMessages.length;
                }
                if (surv.warningMessages && surv.warningMessages.length > 0) {
                    if (ret.length > 0)
                        ret += '<br />';
                    ret += 'Warnings:&nbsp;' + surv.warningMessages.length;
                }
                if (ret.length === 0) {
                    ret = 'OK';
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
                            if (result.developer.developerId === self.developers[i].developerId) {
                                self.developerSelect = self.developers[i];
                                break;
                            }
                        }
                        self.activeDeveloper = self.developerSelect;
                        commonService.getProductsByDeveloper(self.activeDeveloper.developerId)
                            .then(function (products) {
                                self.products = products.products;
                                for (var i = 0; i < self.products.length; i++) {
                                    if (result.product.productId === self.products[i].productId) {
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
                                            if (result.version.versionId === self.versions[i].versionId) {
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

            function loadSurveillance () {
                commonService.getProduct(self.productId)
                    .then(function (result) {
                        self.surveillanceProduct = result;
                    });
            }

            function ternaryFilter (field) {
                if (field == null) {
                    return 'N/A';
                } else {
                    return field ? 'True' : 'False';
                }
            }

            ////////////////////////////////////////////////////////////////////

            function getResources () {
                commonService.getSearchOptions()
                    .then(function (options) {
                        self.resources.bodies = options.certBodyNames;
                        self.resources.classifications = options.productClassifications;
                        self.resources.editions = options.editions;
                        self.resources.practices = options.practiceTypeNames;
                        self.resources.statuses = options.certificationStatuses;
                    });

                commonService.getAtls(false)
                    .then(function (data) {
                        self.resources.testingLabs = data.atls;
                    });

                commonService.getQmsStandards()
                    .then(function (response) {
                        self.resources.qmsStandards = response;
                    });

                commonService.getAccessibilityStandards()
                    .then(function (response) {
                        self.resources.accessibilityStandards = response;
                    });

                commonService.getTestStandards()
                    .then(function (response) {
                        self.resources.testStandards = response;
                    });

                commonService.getUcdProcesses()
                    .then(function (response) {
                        self.resources.ucdProcesses = response;
                    });

                commonService.getTestFunctionality()
                    .then(function (response) {
                        self.resources.testFunctionalities = response;
                    });

                commonService.getTestTools()
                    .then(function (response) {
                        self.resources.testTools = response;
                    });

                commonService.getTargetedUsers()
                    .then(function (response) {
                        self.resources.targetedUsers = response;
                    });
            }

            function prepCodes () {
                var values = {};
                for (var i = 0; i < self.developers.length; i++) {
                    self.developers[i].transMap = {};
                    for (var j = 0; j < self.developers[i].transparencyAttestations.length; j++) {
                        self.developers[i].transMap[self.developers[i].transparencyAttestations[j].acbName] = self.developers[i].transparencyAttestations[j].attestation;
                        values[self.developers[i].transparencyAttestations[j].acbName] = true;
                    }
                }
                self.activeAcbs = [];
                angular.forEach(values, function (value, key) {
                    self.activeAcbs.push(key);
                });
            }
        }]);

    angular.module('app.admin')
        .directive('aiVpManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/cp/vpManagement.html',
                bindToController: {
                    workType: '=',
                    pendingProducts: '=',
                    pendingSurveillances: '=',
                    productId: '='
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'VpManagementController'
            };
        });
})();
