export const CompareComponent = {
    templateUrl: 'chpl.compare/compare.html',
    bindings: {
        compareIds: '<',
    },
    controller: class CompareComponent {
        constructor ($filter, $log, $scope, $stateParams, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.$scope = $scope;
            this.$stateParams = $stateParams;
            this.networkService = networkService;
            this.certificationStatus = utilService.certificationStatus;
            this.sortCerts = utilService.sortCert;
            this.sortCqms = utilService.sortCqm;
            this.products = [];
            this.productList = [];
            this.allCerts = {};
            this.allCqms = {};
        }

        $onInit () {
            if (this.$stateParams.compareIds) {
                this.compareIds = this.$stateParams.compareIds.split('&');
                this.parse();
            }
        }

        $onChanges (changes) {
            if (changes.compareIds) {
                this.compareIds = changes.compareIds.currentValue.split('&');
                if (this.compareIds && this.compareIds.length > 0) {
                    this.parse();
                }
            }
        }

        parse () {
            let that = this;
            for (var i = 0; i < this.compareIds.length; i++) {
                this.networkService.getListing(this.compareIds[i])
                    .then(function (product) {
                        that.updateProductList(product);
                        that.updateCerts(product);
                        that.updateCqms(product);
                        that.fillInBlanks();
                        that.sortAllCerts();
                        that.sortAllCqms();
                        that.products.push(product);
                    }, function (error) {
                        that.$log.error(error);
                    });
            }
        }

        fillInBlanks () {
            var cert, i, k, needToAddBlank, product;
            for (i = 0; i < this.productList.length; i++) {
                product = this.productList[i];
                for (cert in this.allCerts) {
                    needToAddBlank = true;
                    for (k = 0; k < this.allCerts[cert].values.length; k++) {
                        if (this.allCerts[cert].values[k].productId === product.id) {
                            needToAddBlank = false;
                        }
                    }
                    if (needToAddBlank) {
                        this.allCerts[cert].values.push({
                            productId: product.id,
                            allowed: false,
                            certificationDate: product.certificationDate,
                        });
                    }
                }
                for (var cqm in this.allCqms) {
                    needToAddBlank = true;
                    for (k = 0; k < this.allCqms[cqm].values.length; k++) {
                        if (this.allCqms[cqm].values[k].productId === product.id) {
                            needToAddBlank = false;
                        }
                    }
                    if (needToAddBlank) {
                        this.allCqms[cqm].values.push({
                            productId: product.id,
                            allowed: false,
                            certificationDate: product.certificationDate,
                        });
                    }
                }
            }
        }

        isShowing (elem) {
            return this.openCert === elem;
        }

        sortAllCerts () {
            this.sortedCerts = [];
            for (var cert in this.allCerts) {
                this.sortedCerts.push(cert);
            }
            this.sortedCerts = this.$filter('orderBy')(this.sortedCerts,this.sortCerts);
        }

        sortAllCqms () {
            this.sortedCqms = [];
            for (var cqm in this.allCqms) {
                this.sortedCqms.push(cqm);
            }
            this.sortedCqms = this.$filter('orderBy')(this.sortedCqms,this.sortCqms);
        }

        toggle (elem) {
            this.openCert = this.openCert === elem ? '' : elem;
        }

        updateCerts (product) {
            var cert;
            for (var i = 0; i < product.certificationResults.length; i++) {
                cert = product.certificationResults[i];
                if (angular.isUndefined(this.allCerts[cert.number])) {
                    this.allCerts[cert.number] = {number: cert.criterion.number, title: cert.criterion.title, removed: cert.criterion.removed, values: []};
                }
                if (cert.success) {
                    this.allCerts[cert.number].atLeastOne = true;
                }
                this.allCerts[cert.number].values.push({
                    productId: product.id,
                    allowed: true,
                    success: cert.success,
                    certificationDate: product.certificationDate,
                });
            }
        }

        updateCqms (product) {
            var cqm;
            for (var i = 0; i < product.cqmResults.length; i++) {
                cqm = product.cqmResults[i];
                if (cqm.cmsId) {
                    cqm.displayId = cqm.cmsId;
                } else {
                    cqm.displayId = 'NQF-' + cqm.nqfNumber;
                }
                if (angular.isUndefined(this.allCqms[cqm.displayId])) {
                    this.allCqms[cqm.displayId] = {displayId: cqm.displayId, title: cqm.title, values: []};
                }
                if (cqm.success) {
                    this.allCqms[cqm.displayId].atLeastOne = true;
                }
                this.allCqms[cqm.displayId].values.push({
                    productId: product.id,
                    allowed: true,
                    success: cqm.success,
                    certificationDate: product.certificationDate,
                    successVersions: cqm.successVersions,
                });
            }
        }

        updateProductList (product) {
            this.hasNon2015 = this.hasNon2015 || product.certificationEdition.name !== '2015';
            this.productList.push({
                id: product.id,
                certificationDate: product.certificationDate,
            });
        }
    },
}

angular.module('chpl.compare')
    .component('chplCompare', CompareComponent);
