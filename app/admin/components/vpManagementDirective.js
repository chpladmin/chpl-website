;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('VpManagementController', ['commonService', 'adminService', 'authService', '$log', function (commonService, adminService, authService, $log) {
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

            commonService.getVendors()
                .then(function (vendors) {
                    self.vendors = vendors.vendors;
                });
            self.cps = [{type: 'cp', value: '2015-04-28'}, {type: 'cp', value: '2014-08-12'}];

            self.selectVendor = function () {
                if (self.vendorSelect) {
                    if (self.vendorSelect.length === 1) {
                        self.activeVendor = [self.vendorSelect[0]];
                        commonService.getProductsByVendor(self.activeVendor[0].vendorId)
                            .then(function (products) {
                                $log.info(products);
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
                    self.activeVersion = self.versionSelect;
/*                    commonService.getCPsByVersion(self.activeVersion[0].versionId)
                        .then(function (cps) {
                            self.cps = cps;
                        });*/
                }
            };
            self.selectCP = function () {
                if (self.cpSelect) {
                    commonService.getProduct(self.cpSelect[0])
                        .then(function (product) {
                            self.activeCP = product;
                            self.activeCP.certDate = new Date(self.activeCP.certDate);
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

            self.uploadFile = function () {
                // Do something smart here
                self.uploadingCps = [{id: 1, vendor: {name: 'Vend', lastModifiedDate: '2013-03-02'}, product: {name: 'Prod', lastModifiedDate: '2014-05-02'},
                                      version: {name: '1.2.3'}, edition: '2014', uploadDate: '2015-07-02'},
                                     {id: 2, vendor: {name: 'Denv', lastModifiedDate: '2013-02-02'}, product: {name: 'Dorp', lastModifiedDate: '2013-05-02'},
                                      version: {name: '332.1'}, edition: '2011', uploadDate: '2012-07-02'},
                                     {id: 3, vendor: {name: 'LastCo', lastModifiedDate: '2015-03-02'}, product: {name: 'Healthy', lastModifiedDate: '2014-10-02'},
                                      version: {name: '12Ac'}, edition: '2014', uploadDate: '2015-03-22'}];
            };

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
                                            self.products = products;
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
                //                self.updateVersion = {productIds: []};

                adminService.updateVersion(self.activeVersion)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            var newVersion = response;
                            self.versionMessage = null;
                            self.editVersion = false;
                            // call sevice
                            /*
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
                            */
                        } else {
                            self.versionMessage = 'An error occurred. Please check your entry and try again.';
                        }
                    });
            };
        }]);

    angular.module('app.admin')
        .directive('aiVpManagement', ['commonService', '$log', function (commonService, $log) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/vpManagement.html',
                scope: {},
                controllerAs: 'vm',
                controller: 'VpManagementController'
            };
        }]);
})();
