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

            commonService.getUploadingCps()
                .then(function (cps) {
                    self.uploadingCps = [].concat(cps);
                    self.uploadingCps = []; //dev erasing
                });

            self.uploader = new FileUploader({
                url: API + '/certified_product/upload',
                removeAfterUpload: true,
                headers: { Authorization: 'Bearer ' + authService.getToken() }
            });

            commonService.getVendors()
                .then(function (vendors) {
                    self.vendors = vendors.vendors;
                });

            self.selectVendor = function () {
                if (self.vendorSelect) {
                    if (self.vendorSelect.length === 1) {
                        self.activeVendor = [self.vendorSelect[0]];
                        commonService.getProductsByVendor(self.activeVendor[0].vendorId)
                            .then(function (products) {
                                self.products = products.products;
                            });
                    } else { // merging
                        self.activeVendor = [].concat(self.vendorSelect);
                        self.mergeVendor = angular.copy(self.activeVendor[0]);
                        delete self.mergeVendor.vendorId;
                        delete self.mergeVendor.lastModifiedDate;
                    }
                }
            };
            self.selectProduct = function () {
                if (self.productSelect) {
                    if (self.productSelect.length === 1) {
                        self.activeProduct = [self.productSelect[0]];
                        self.activeProduct[0].vendorId = self.activeVendor[0].vendorId;
                        commonService.getVersionsByProduct(self.activeProduct[0].productId)
                            .then(function (versions) {
                                self.versions = versions;
                            });
                    } else { //merging
                        self.activeProduct = [].concat(self.productSelect);
                        self.mergeProduct = angular.copy(self.activeProduct[0]);
                        delete self.mergeProduct.productId;
                        delete self.mergeProduct.lastModifiedDate;
                    }
                }
            };
            self.selectVersion = function () {
                if (self.versionSelect) {
                    if (self.versionSelect.length === 1) {
                        self.activeVersion = [self.versionSelect[0]];
                        self.activeVersion[0].productId = self.activeProduct[0].productId;
                        commonService.getProductsByVersion(self.activeVersion[0].versionId)
                            .then(function (cps) {
                                self.cps = cps;
                            });
                    } else { //merging
                        self.activeVersion = [].concat(self.versionSelect);
                        self.mergeVersion = angular.copy(self.activeVersion[0]);
                        delete self.mergeVersion.versionId;
                        delete self.mergeVersion.lastModifiedDate;
                    }
                }
            };
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

            commonService.getEditions()
                .then(function (editions) { self.editions = editions; });
            commonService.getClassifications()
                .then(function (classifications) { self.classifications = classifications; });
            commonService.getPractices()
                .then(function (practices) { self.practices = practices; });
            commonService.getCertBodies()
                .then(function (bodies) { self.bodies = bodies; });
            self.statuses = [{id: '1', name: 'Active'},{id: '2', name: 'Retired'},
                             {id: '3', name: 'Withdrawn'},{id: '4', name: 'Decertified'}];


            self.inspectCp = function (cpId) {
                var cp;
                for (var i = 0; i < self.uploadingCps.length; i++) {
                    if (cpId === self.uploadingCps[i].id) {
                        self.inspectingCp = self.uploadingCps[i];
                        cp = self.inspectingCp;
                    }
                }
                self.activeVendor = [cp.vendor];
                self.activeProduct = [cp.product];
                self.activeVersion = cp.version;
                commonService.getProduct('dev') //cpId?
                    .then(function (product) {
                        self.activeCP = product;
                        self.activeCP.certDate = new Date(self.activeCP.certDate);
                    });
            };

            self.confirmCp = function (cpId) {
                // Do something with a service here
                self.inspectingCp = '';
                self.activeVendor = '';
                self.activeProduct = '';
                self.activeVersion = '';
                self.activeCP = '';
                for (var i = 0; i < self.uploadingCps.length; i++) {
                    if (cpId === self.uploadingCps[i].id) {
                        self.uploadingCps.splice(i,1);
                    }
                }
            };

            self.cancelCp = function () {
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
            };

            self.cancelProduct = function () {
                self.activeProduct = '';
                self.productMessage = null;
                self.editProduct = false;
            };

            self.cancelVersion = function () {
                self.activeVersion = '';
                self.versionMessage = null;
                self.editVersion = false;
            };

            self.cancelCP = function () {
                self.activeCP = '';
                self.cpMessage = null;
                self.editCP = false;
            };

            self.mergeAddressRequired = function () {
                return self.addressCheck(self.mergeVendor);
            }

            self.addressRequired = function () {
                return self.addressCheck(self.activeVendor[0]);
            };

            self.addressCheck = function (v) {
                if (v.address === null) return false;
                if (v.address.line1 && v.address.line1.length > 0) return true;
                if (v.address.line2 && v.address.line2.length > 0) return true;
                if (v.address.city && v.address.city.length > 0) return true;
                if (v.address.region && v.address.region.length > 0) return true;
                if (v.address.country && v.address.country.length > 0) return true;
                return false;
            };

            self.saveVendor = function () {
                self.updateVendor = {vendorIds: []};

                for (var i = 0; i < self.activeVendor.length; i++) {
                    self.updateVendor.vendorIds.push(self.activeVendor[i].vendorId);
                }
                if (self.activeVendor.length === 1) {
                    self.updateVendor.vendor = self.activeVendor[0];
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
                                    self.activeVendor = [newVendor];
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
            };

            self.saveProduct = function () {
                self.updateProduct = {productIds: []};

                for (var i = 0; i < self.activeProduct.length; i++) {
                    self.updateProduct.productIds.push(self.activeProduct[i].productId);
                }
                if (self.activeProduct.length === 1) {
                    self.updateProduct.product = self.activeProduct[0];
                    self.updateProduct.newVendorId = self.activeProduct[0].vendorId;
                } else {
                    self.updateProduct.product = self.mergeProduct;
                    self.updateProduct.newVendorId = self.activeVendor[0].vendorId;
                }

                adminService.updateProduct(self.updateProduct)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            var newProduct = response;
                            self.productMessage = null;
                            self.editProduct = false;
                            commonService.getProductsByVendor(self.activeVendor[0].vendorId)
                                .then(function (products) {
                                    self.products = products.products;
                                    self.activeProduct = [newProduct];
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

            };
            self.saveVersion = function () {
                self.updateVersion = {versionIds: []};

                for (var i = 0; i < self.activeVersion.length; i++) {
                    self.updateVersion.versionIds.push(self.activeVersion[i].versionId);
                }
                self.updateVersion.newProductId = self.activeProduct[0].productId;
                if (self.activeVersion.length === 1) {
                    self.updateVersion.version = self.activeVersion[0];
                } else {
                    self.updateVersion.version = self.mergeVersion;
                }

                adminService.updateVersion(self.updateVersion)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            var newVersion = response;
                            self.versionMessage = null;
                            self.editVersion = false;
                            commonService.getVersionsByProduct(self.activeProduct[0].productId)
                                .then(function (versions) {
                                    self.versions = versions.versions;
                                    self.activeVersion = [newVersion];
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
            };

            self.saveCP = function () {
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
                self.updateCP.otherAcb = self.activeCP.otherAcb;;
                self.updateCP.testingLabId = self.activeCP.testingLabId;
                self.updateCP.isChplVisible = self.activeCP.visibleOnChpl;

                self.editCP = false;
                $log.debug(self.updateCP);

                adminService.updateCP(self.updateCP)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                        self.editCP = false;
                            self.activeCP = response;
                            self.activeCP.certDate = new Date(self.activeCP.certificationDate.split(' ')[0]);
                        } else {
                            self.cpMessage = 'An error occurred. Please check your entry and try again.';
                        }
                    });
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
