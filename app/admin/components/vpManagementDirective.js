;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('VpManagementController', ['commonService', 'adminService', 'authService', '$log', 'FileUploader', 'API', function (commonService, adminService, authService, $log, FileUploader, API) {
            var self = this;
            self.activeVendor = '';
            self.activeProduct = '';
            self.activeVersion = '';
            self.activeCP = '';
            self.isChplAdmin = authService.isChplAdmin();
            self.isAcbAdmin = authService.isAcbAdmin();
            self.uploadingCps = [];
            self.inspectingCp = '';
            self.workType = 'upload';

            self.activate = activate;
            self.refreshPending = refreshPending;
            self.selectVendor = selectVendor;
            self.selectProduct = selectProduct;
            self.selectVersion = selectVersion;
            self.saveVendor = saveVendor;
            self.saveProduct = saveProduct;
            self.saveVersion = saveVersion;

            self.activate();

            /////////////////////////////////////////////////////////

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
                        self.uploadingCps = self.uploadingCps.concat(response.pendingCertifiedProducts);
                        self.workType = 'confirm';
                    };
                    self.uploader.onErrorItem = function(fileItem, response, status, headers) {
                        $log.info('onErrorItem', fileItem, response, status, headers);
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

            self.selectCP = function () {
                if (self.cpSelect) {
                    self.activeCP = {};
                    self.activeCP.classificationType = {};
                    self.activeCP.certifyingBody = {};
                    self.activeCP.practiceType = {};
                    commonService.getProduct(self.cpSelect[0])
                        .then(function (cp) {
                            self.activeCP = cp;
                            if (self.activeCP.visibleOnChpl === undefined)
                                self.activeCP.visibleOnChpl = true;
                            self.activeCP.certDate = new Date(self.activeCP.certificationDate.split(' ')[0]);
                        });
                }
            };

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

            self.getStatusText = function (statusId) {
                for (var i = 0; i < self.statuses.length; i++) {
                    if (self.statuses[i].id === statusId) {
                        return self.statuses[i].name;
                    }
                }
                return 'Unknown';
            }
            self.parseCertificationDate = function (certDate) {
                if (certDate && certDate.indexOf(' ') > 0) {
                    return certDate.split(' ')[0];
                } else {
                    return certDate;
                }
            }
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
                        self.inspectingCp = self.uploadingCps[i];
                        cp = self.inspectingCp;
                    }
                }
                self.activeVendor = angular.copy(cp.vendor);
                self.activeProduct = angular.copy(cp.product);
                self.activeVersion = angular.copy(cp.product);
                self.activeCP = angular.copy(cp);
                self.activeCP.certificationStatus = {id: 5, name: 'Pending'};
                self.activeCP.certificationDate = new Date(parseInt(cp.certificationDate));
                self.activeCP.certDate = self.activeCP.certificationDate;
                self.activeCP.certificationStatusId = '5';

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
            };

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
                adminService.confirmPendingCp(self.inspectingCp)
                    .then(self.refreshPending);

                self.inspectingCp = '';
                self.activeVendor = '';
                self.activeProduct = '';
                self.activeVersion = '';
                self.activeCP = '';
            };

            self.cancelCp = function () {
                self.inspectingCp = '';
                self.activeVendor = '';
                self.activeProduct = '';
                self.activeVersion = '';
                self.activeCP = '';
            };

            self.rejectCp = function (cpId) {
                adminService.rejectPendingCp(cpId)
                    .then(self.refreshPending);

                self.inspectingCp = '';
                self.activeVendor = '';
                self.activeProduct = '';
                self.activeVersion = '';
                self.activeCP = '';
            };

            self.cancelVendor = function () {
                // todo: figure out how to actually cancel the edits
                self.activeVendor = '';
                self.vendorMessage = null;
                self.editVendor = false;
                self.selectVendor();
            };

            self.cancelProduct = function () {
                self.activeProduct = '';
                self.productMessage = null;
                self.editProduct = false;
                self.selectProduct();
            };

            self.cancelVersion = function () {
                self.activeVersion = '';
                self.versionMessage = null;
                self.editVersion = false;
                self.selectVersion();
            };

/*            self.startEditingCp(shouldStart) {
                if (shouldStart) {
                    self.isEditing = */
            self.cancelCP = function () {
                self.activeCP = '';
                self.cpMessage = null;
                self.editCP = false;
                self.selectCP();
            };

            self.mergeAddressRequired = function () {
                return self.addressCheck(self.mergeVendor);
            }

            self.addressRequired = function () {
                return self.addressCheck(self.activeVendor);
            };

            self.addressCheck = function (v) {
                if (v.address === null) return false;
                if (v.address.line1 && v.address.line1.length > 0) return true;
                if (v.address.line2 && v.address.line2.length > 0) return true;
                if (v.address.city && v.address.city.length > 0) return true;
                if (v.address.state && v.address.state.length > 0) return true;
                if (v.address.zipcode && v.address.zipcode.length > 0) return true;
                if (v.address.country && v.address.country.length > 0) return true;
                return false;
            };

            function saveVendor () {
                if (self.inspectingCp) {
                    $log.info(self.inspectingCp, self.activeVendor);
                    self.inspectingCp.vendor = self.activeVendor;
                    self.editVendor = false;
                } else {
                    self.updateVendor = {vendorIds: []};

                    var addActive = true;
                    for (var i = 0; i < self.mergingVendors.length; i++) {
                        self.updateVendor.vendorIds.push(self.mergingVendors[i].vendorId);
                        if (self.mergingVendors[i].vendorId === self.activeVendor.vendorId) {
                            addActive = false;
                        }
                    }
                    if (addActive) {
                        self.updateVendor.vendorIds.push(self.activeVendor.vendorId);
                    }
                    if (self.activeVendor.length === 1) {
                        self.updateVendor.vendor = self.activeVendor;
                    } else {
                        self.updateVendor.vendor = self.mergeVendor;
                    }

                    adminService.updateVendor(self.updateVendor)
                        .then(function (response) {
                            if (!response.status || response.status === 200) {
                                var newVendor = response;
                                self.vendorMessage = null;
                                self.editVendor = false;
                                commonService.getVendors()
                                    .then(function (vendors) {
                                        self.vendors = vendors.vendors;
                                        self.activeVendor = newVendor;
                                        //todo: re-select active vendor in vendorSelect
                                        commonService.getProductsByVendor(newVendor.vendorId)
                                            .then(function (products) {
                                                self.products = products.products;
                                            });
                                    });
                            } else {
                                self.vendorMessage = 'An error occurred. Please check your entry and try again.';
                            }
                        });
                }
            };

            function saveProduct () {
                if (self.inspectingCp) {
                    self.inspectingCp.product = self.activeProduct;
                    $log.info(self.inspectingCp, self.activeProduct);
                    self.editProduct = false;
                } else {
                    self.updateProduct = {productIds: []};

                    var addActive = true;

                    for (var i = 0; i < self.mergingProducts.length; i++) {
                        self.updateProduct.productIds.push(self.mergingProducts[i].productId);
                        if (self.mergingProducts[i].productId === self.activeProduct.productId) {
                            addActive = false;
                        }
                    }
                    if (addActive) {
                        self.updateProduct.productIds.push(self.activeProduct.productId);
                    }
                    if (self.mergingProducts.length === 1) {
                        self.updateProduct.product = self.activeProduct;
                        self.updateProduct.newVendorId = self.activeProduct.vendorId;
                    } else {
                        self.updateProduct.product = self.mergeProduct;
                        self.updateProduct.newVendorId = self.activeVendor.vendorId;
                    }

                    adminService.updateProduct(self.updateProduct)
                        .then(function (response) {
                            if (!response.status || response.status === 200) {
                                var newProduct = response;
                                self.productMessage = null;
                                self.editProduct = false;
                                commonService.getProductsByVendor(self.activeVendor.vendorId)
                                    .then(function (products) {
                                        self.products = products.products;
                                        self.activeProduct = newProduct;
                                        //todo: re-select active vendor in vendorSelect
                                        commonService.getVersionsByProduct(newProduct.productId)
                                            .then(function (versions) {
                                                self.versions = versions;
                                            });
                                    });
                            } else {
                                self.productMessage = 'An error occurred. Please check your entry and try again.';
                            }
                        });
                }
            }

            function saveVersion () {
                if (self.inspectingCp) {
                    self.inspectingCp.product.version = self.activeVersion.version;
                    self.inspectingCp.product.versionId = self.activeVersion.versionId;
                    $log.info(self.inspectingCp, self.activeVersion);
                    self.editVersion = false;
                } else {
                    self.updateVersion = {versionIds: []};

                    var addActive = true;

                    for (var i = 0; i < self.mergingVersions.length; i++) {
                        self.updateVersion.versionIds.push(self.mergingVersions[i].versionId);
                        if (self.mergingVersions[i].versionId === self.activeVersion.versionId) {
                            addActive = false;
                        }
                    }
                    if (addActive) {
                        self.updateVersion.versionIds.push(self.activeVersion.versionId);
                    }
                    self.updateVersion.newProductId = self.activeProduct.productId;
                    if (self.mergingVersions.length === 1) {
                        self.updateVersion.version = self.activeVersion;
                    } else {
                        self.updateVersion.version = self.mergeVersion;
                    }

                    adminService.updateVersion(self.updateVersion)
                        .then(function (response) {
                            if (!response.status || response.status === 200) {
                                var newVersion = response;
                                self.versionMessage = null;
                                self.editVersion = false;
                                commonService.getVersionsByProduct(self.activeProduct.productId)
                                    .then(function (versions) {
                                        self.versions = versions.versions;
                                        self.activeVersion = newVersion;
                                        //todo: re-select active version in versionSelect
                                        commonService.getProductsByVersion(newVersion.versionId)
                                            .then(function (cps) {
                                                self.cps = cps;
                                            });
                                    });
                            } else {
                                self.versionMessage = 'An error occurred. Please check your entry and try again.';
                            }
                        });
                }
            };

            self.saveCP = function () {
                if (self.inspectingCp) {
                    self.editCP = false;
                } else {
                    self.updateCP = {};

                    self.updateCP.id = self.activeCP.id;
                    self.updateCP.certificationBodyId = self.activeCP.certifyingBody.id;
                    self.updateCP.practiceTypeId = self.activeCP.practiceType.id;
                    self.updateCP.productClassificationTypeId = self.activeCP.classificationType.id;
                    self.updateCP.certificationStatusId = self.activeCP.certificationStatusId;
                    self.updateCP.chplProductNumber = self.activeCP.chplProductNumber;
                    self.updateCP.reportFileLocation = self.activeCP.reportFileLocation;
                    self.updateCP.qualityManagementSystemAtt = self.activeCP.qualityManagementSystemAtt;
                    self.updateCP.acbCertificationId = self.activeCP.acbCertificationId;
                    self.updateCP.otherAcb = self.activeCP.otherAcb;
                    self.updateCP.testingLabId = self.activeCP.testingLabId;
                    self.updateCP.isChplVisible = self.activeCP.visibleOnChpl;

                    self.editCP = false;
                    $log.debug(self.updateCP);

                    adminService.updateCP(self.activeCP)
                        .then(function (response) {
                            if (!response.status || response.status === 200) {
                                self.editCP = false;
                                self.activeCP = response;
                                self.activeCP.certDate = new Date(self.activeCP.certificationDate.split(' ')[0]);
                            } else {
                                self.cpMessage = 'An error occurred. Please check your entry and try again.';
                            }
                        });
                }
            };

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
