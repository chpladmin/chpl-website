;(function () {
    'use strict';

    angular.module('app.admin')
        .directive('aiVpManagement', ['commonService', '$log', function (commonService, $log) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/vpManagement.html',
                scope: {},
                controllerAs: 'vm',
                controller: function () {
                    var self = this;
                    self.activeVendor = '';
                    self.activeProduct = '';
                    self.activeVersion = '';
                    self.activeCP = '';
                    /*
                    commonService.getProduct('dev product')
                        .then(function (product) {
                            self.activeCP = product;
                        });
                        */
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
                            self.activeVendor = {name: self.vendorSelect[0],
                                                 address: '123 main st',
                                                 lastModifiedDate: '2015-03-13' };
                        };
                    };
                    self.selectProduct = function () {
                        if (self.productSelect) {
                            self.activeProduct = {name: self.productSelect[0],
                                                  details: 'Some product details',
                                                  lastModifiedDate: '2015-03-13' };
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
                                });
                        }
                    };
                }
            };
        }]);
})();
