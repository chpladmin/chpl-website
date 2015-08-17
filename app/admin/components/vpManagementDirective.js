;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('VpManagementController', ['commonService', 'authService', '$log', function (commonService, authService, $log) {
            var self = this;
            self.activeVendor = '';
            self.activeProduct = '';
            self.activeVersion = '';
            self.activeCP = '';
            self.isChplAdmin = authService.isChplAdmin();
            self.isAcbAdmin = authService.isAcbAdmin();
            self.uploadingCps = [];
            self.inspectingCp = '';
            /*
              commonService.getProduct('dev product')
              .then(function (product) {
              self.activeCP = product;
              self.activeCP.certDate = new Date(self.activeCP.certDate);
              });
            */
            commonService.getUploadingCps()
                .then(function (cps) {
                    self.uploadingCps = [].concat(cps);
                    self.uploadingCps = []; //dev erasing
                });
            commonService.getVendors()
                .then(function (vendors) {
                    self.vendors = vendors;
                });
            commonService.getProducts()
                .then(function (products) {
                    self.products = products;
                });
            /*commonService.getVersions()
              .then(function (versions) {
              self.versions = versions;
              });*/
            self.versions = [{type: 'version', value: '123.234'}, {type: 'version', value: '1.4.21'}];
            /*commonService.getCertifiedProducts()
              .then(function (CPs) {
              self.cps = CPs;
              });*/
            self.cps = [{type: 'cp', value: '2015-04-28'}, {type: 'cp', value: '2014-08-12'}];

            self.selectVendor = function () {
                if (self.vendorSelect) {
                    if (self.vendorSelect.length === 1) {
                        /*
                          commonService.getVendor(self.vendorSelect[0])
                          .then(function (vendor) {
                          self.activeVendor = vendor;
                          });
                        */
                        self.activeVendor = [{name: self.vendorSelect[0],
                                              address: {
                                                  line1: '123 main st',
                                                  line2: 'Suite 170',
                                                  city: 'Springfield',
                                                  region: 'Southerly',
                                                  country: 'USA'
                                              },
                                              lastModifiedDate: '2015-03-13' }];
                    } else if (self.vendorSelect.length > 1) {
                        self.activeVendor = [];
                        for (var i = 0; i < self.vendorSelect.length; i++) {
                            /*
                              commonService.getVendor(self.vendorSelect[i])
                              .then(function (vendor) {
                              self.activeVendor.push(vendor);
                              });
                            */
                            self.activeVendor = [
                                {name: self.vendorSelect[0],
                                 address: {
                                     line1: '123 main st',
                                     line2: 'Suite 170',
                                     city: 'Springfield',
                                     region: 'Southerly',
                                     country: 'USA'
                                 },
                                 lastModifiedDate: '2015-03-13' }
                                ,
                                {name: self.vendorSelect[1],
                                 address: {
                                     line1: '123 main street',
                                     line2: 'Ste 170',
                                     city: 'Springfield',
                                     region: 'Southerly-Westerly',
                                     country: 'USA'
                                 },
                                 lastModifiedDate: '2015-03-14' }];
                        }
                    }
                }
            };
            self.selectProduct = function () {
                if (self.productSelect) {
                    if (self.productSelect.length === 1) {
                        self.activeProduct = [{name: self.productSelect[0],
                                               details: 'Some product details',
                                               lastModifiedDate: '2015-03-13' }];
                    } else if (self.productSelect.length > 1) {
                        self.activeProduct = [];
                        for (var i = 0; i < self.productSelect.length; i++) {
                            /* commonService.getProduct */
                        }
                        self.activeProduct = [
                            {name: self.productSelect[0],
                             details: 'Some product details',
                             lastModifiedDate: '2015-03-13' }
                            ,
                            {name: self.productSelect[1],
                             details: 'Some other details',
                             lastModifiedDate: '2015-02-12' }];
                    }
                }
            };
            self.selectVersion = function () {
                if (self.versionSelect) {
                    self.activeVersion = {name: self.versionSelect[0],
                                          details: 'Some product version details',
                                          lastModifiedDate: '2015-03-13' };
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

            self.cancelCp = function (cpId) {
                self.inspectingCp = '';
                self.activeVendor = '';
                self.activeProduct = '';
                self.activeVersion = '';
                self.activeCP = '';
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
