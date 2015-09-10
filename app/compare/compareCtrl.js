;(function () {
    'use strict';

    angular.module('app.compare')
        .controller('CompareController', ['$scope', '$log', '$routeParams', 'commonService', function($scope, $log, $routeParams, commonService) {
            var self = this;
            var compareString = $routeParams.compareIds;
            self.products = [];
            self.productList = [];
            self.allCerts = {};
            self.allCqms = {};
            if (compareString && compareString.length > 0) {
                self.compareIds = compareString.split('&');

                var successResult = function (product) {
                    product.certificationDate = product.certificationDate.split(' ')[0];
                    self.updateProductList(product);
                    self.updateCerts(product);
                    self.updateCqms(product);
                    self.fillInBlanks();
                    self.products.push(product);
                };
                var failResult = function (error) { $log.error(error); };

                for (var i = 0; i < self.compareIds.length; i++) {
                    commonService.getProduct(self.compareIds[i])
                        .then(successResult, failResult);
                }
            };

            self.updateProductList = function (product) {
                self.productList.push({id: product.id, certDate: product.certificationDate});
            };

            self.updateCerts = function (product) {
                var cert;
                for (var i = 0; i < product.certificationResults.length; i++) {
                    cert = product.certificationResults[i];
                    if (self.allCerts[cert.number] === undefined)
                        self.allCerts[cert.number] = {number: cert.number, title: cert.title, values: []};
                    self.allCerts[cert.number].values.push({productId: product.id, success: cert.success, certDate: product.certificationDate});
                }
            };

            self.updateCqms = function (product) {
                var cqm;
                for (var i = 0; i < product.cqmResults.length; i++) {
                    cqm = product.cqmResults[i];
                    if (self.allCqms[cqm.number] === undefined)
                        self.allCqms[cqm.number] = {number: cqm.number, title: cqm.title, values: []};
                    self.allCqms[cqm.number].values.push({productId: product.id, success: cqm.success, allowed: true, version: cqm.version, certDate: product.certificationDate});
                }
            }

            self.fillInBlanks = function () {
                var needToAddBlank, product;
                for (var i = 0; i < self.productList.length; i++) {
                    product = self.productList[i];
                    for (var cqm in self.allCqms) {
                        needToAddBlank = true;
                        for (var k = 0; k < self.allCqms[cqm].values.length; k++) {
                            if (self.allCqms[cqm].values[k].productId === product.id) {
                                needToAddBlank = false;
                            }
                        }
                        if (needToAddBlank) {
                            self.allCqms[cqm].values.push({productId: product.id, allowed: false, certDate: product.certDate});
                        }
                    }
                }
            };

            self.toggle = function (elem) {
                self.openCert = self.openCert === elem ? '' : elem;
            };

            self.isShowing = function (elem) {
                return self.openCert === elem;
            };
        }]);
})();
