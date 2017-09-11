(function () {
    'use strict';

    angular.module('chpl.compare')
        .controller('CompareController', CompareController);

    /** @ngInject */
    function CompareController ($filter, $log, $routeParams, networkService, utilService) {
        var vm = this;

        vm.fillInBlanks = fillInBlanks;
        vm.isShowing = isShowing;
        vm.sortAllCerts = sortAllCerts;
        vm.sortAllCqms = sortAllCqms;
        vm.sortCerts = utilService.sortCert;
        vm.sortCqms = utilService.sortCqm;
        vm.toggle = toggle;
        vm.updateCerts = updateCerts;
        vm.updateCqms = updateCqms;
        vm.updateProductList = updateProductList;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            var compareString = $routeParams.compareIds;
            vm.products = [];
            vm.productList = [];
            vm.allCerts = {};
            vm.allCqms = {};
            if (compareString && compareString.length > 0) {
                vm.compareIds = compareString.split('&');

                for (var i = 0; i < vm.compareIds.length; i++) {
                    networkService.getProduct(vm.compareIds[i])
                        .then(function (product) {
                            vm.updateProductList(product);
                            vm.updateCerts(product);
                            vm.updateCqms(product);
                            vm.fillInBlanks();
                            vm.sortAllCerts();
                            vm.sortAllCqms();
                            vm.products.push(product);
                        }, function (error) { $log.error(error); });
                }
            }
        }

        function fillInBlanks () {
            var cert, i, k, needToAddBlank, product;
            for (i = 0; i < vm.productList.length; i++) {
                product = vm.productList[i];
                for (cert in vm.allCerts) {
                    needToAddBlank = true;
                    for (k = 0; k < vm.allCerts[cert].values.length; k++) {
                        if (vm.allCerts[cert].values[k].productId === product.id) {
                            needToAddBlank = false;
                        }
                    }
                    if (needToAddBlank) {
                        vm.allCerts[cert].values.push({
                            productId: product.id,
                            allowed: false,
                            certificationDate: product.certificationDate,
                        });
                    }
                }
                for (var cqm in vm.allCqms) {
                    needToAddBlank = true;
                    for (k = 0; k < vm.allCqms[cqm].values.length; k++) {
                        if (vm.allCqms[cqm].values[k].productId === product.id) {
                            needToAddBlank = false;
                        }
                    }
                    if (needToAddBlank) {
                        vm.allCqms[cqm].values.push({
                            productId: product.id,
                            allowed: false,
                            certificationDate: product.certificationDate,
                        });
                    }
                }
            }
        }

        function isShowing (elem) {
            return vm.openCert === elem;
        }

        function sortAllCerts () {
            vm.sortedCerts = [];
            for (var cert in vm.allCerts) {
                vm.sortedCerts.push(cert);
            }
            vm.sortedCerts = $filter('orderBy')(vm.sortedCerts,vm.sortCerts);
        }

        function sortAllCqms () {
            vm.sortedCqms = [];
            for (var cqm in vm.allCqms) {
                vm.sortedCqms.push(cqm);
            }
            vm.sortedCqms = $filter('orderBy')(vm.sortedCqms,vm.sortCqms);
        }

        function toggle (elem) {
            vm.openCert = vm.openCert === elem ? '' : elem;
        }

        function updateCerts (product) {
            var cert;
            for (var i = 0; i < product.certificationResults.length; i++) {
                cert = product.certificationResults[i];
                if (angular.isUndefined(vm.allCerts[cert.number])) {
                    vm.allCerts[cert.number] = {number: cert.number, title: cert.title, values: []};
                }
                if (cert.success) {
                    vm.allCerts[cert.number].atLeastOne = true;
                }
                vm.allCerts[cert.number].values.push({
                    productId: product.id,
                    allowed: true,
                    success: cert.success,
                    certificationDate: product.certificationDate,
                });
            }
        }

        function updateCqms (product) {
            var cqm;
            for (var i = 0; i < product.cqmResults.length; i++) {
                cqm = product.cqmResults[i];
                if (cqm.cmsId) {
                    cqm.displayId = cqm.cmsId;
                } else {
                    cqm.displayId = 'NQF-' + cqm.nqfNumber;
                }
                if (angular.isUndefined(vm.allCqms[cqm.displayId])) {
                    vm.allCqms[cqm.displayId] = {displayId: cqm.displayId, title: cqm.title, values: []};
                }
                if (cqm.success) {
                    vm.allCqms[cqm.displayId].atLeastOne = true;
                }
                vm.allCqms[cqm.displayId].values.push({
                    productId: product.id,
                    allowed: true,
                    success: cqm.success,
                    certificationDate: product.certificationDate,
                    successVersions: cqm.successVersions,
                });
            }
        }

        function updateProductList (product) {
            vm.hasNon2015 = vm.hasNon2015 || product.certificationEdition.name !== '2015';
            vm.productList.push({
                id: product.id,
                certificationDate: product.certificationDate,
            });
        }
    }
})();
