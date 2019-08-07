export const ProductsComponent = {
    templateUrl: 'chpl.organizations/developers/products/products.html',
    bindings: {
        developer: '<',
        product: '<',
        products: '<',
        versions: '<',
    },
    controller: class ProductsComponent {
        constructor ($log, $scope, $state, $stateParams, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.backup = {};
            this.splitEdit = true;
            this.movingVersions = [];
            this.validState = true;
        }

        $onInit () {
            let that = this;
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                this.loadDevelopers();
            }
            let loggedIn = this.$scope.$on('loggedIn', function () {
                that.loadDevelopers();
            })
            this.$scope.$on('$destroy', loggedIn);
        }

        $onChanges (changes) {
            this.action = this.$stateParams.action;
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
            if (changes.product) {
                this.product = angular.copy(changes.product.currentValue);
                this.newProduct = angular.copy(this.product);
                this.backup.product = angular.copy(this.product);
            }
            if (changes.products) {
                this.products = changes.products.currentValue.products.filter(p => p.productId !== this.product.productId);
                this.mergingProducts = changes.products.currentValue.products.filter(p => p.productId === this.product.productId);
                this.backup.products = angular.copy(this.products);
                this.backup.mergingProducts = angular.copy(this.mergingProducts);
            }
            if (changes.versions) {
                this.versions = angular.copy(changes.versions.currentValue);
                this.backup.versions = angular.copy(this.versions);
            }
            if (this.developer && this.product) {
                this.validState = this.developer.developerId === this.product.owner.developerId;
            }
        }

        can (action) {
            if (action === 'split-product' && this.versions.length < 2) { return false; } // cannot split product without at least two versions
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) { return true; } // can do everything
            if (action === 'merge') { return false; } // if not above roles, can't merge
            return this.developer.status.status === 'Active' && this.hasAnyRole(['ROLE_ACB']); // must be active
        }

        cancel () {
            this.product = angular.copy(this.backup.product);
            this.newProduct = angular.copy(this.product);
            this.products = angular.copy(this.backup.products);
            this.versions = angular.copy(this.backup.versions);
            this.mergingProducts = angular.copy(this.backup.mergingProducts);
            this.movingVersions = [];
            this.action = undefined;
            this.splitEdit = true;
        }

        cancelSplitEdit () {
            this.newProduct = angular.copy(this.product);
            this.splitEdit = false;
        }

        loadDevelopers () {
            let that = this;
            this.networkService.getDevelopers().then(response => {
                that.developers = response.developers;
            });
        }

        save (product) {
            let productIds = [];
            if (this.action === 'merge') {
                productIds = productIds.concat(this.mergingProducts.map(prod => prod.productId));
            } else {
                productIds.push(this.product.productId);
            }
            let that = this;
            this.product = product;
            this.errorMessages = [];
            this.networkService.updateProduct({
                product: this.product,
                productIds: productIds,
                newDeveloperId: this.product.owner.developerId,
            }).then(response => {
                if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                    if (that.action === 'merge') {
                        that.$state.go('organizations.developers.products', {
                            action: undefined,
                            developerId: that.developer.developerId,
                            productId: response.productId,
                        });
                    } else {
                        that.$state.go('organizations.developers.products', {
                            action: undefined,
                            developerId: response.owner.developerId,
                            productId: response.productId,
                        }, {
                            reload: true,
                        });
                    }
                } else {
                    if (response.data.errorMessages) {
                        that.errorMessages = response.data.errorMessages;
                    } else if (response.data.error) {
                        that.errorMessages.push(response.data.error);
                    } else {
                        that.errorMessages = ['An error has occurred.'];
                    }
                }
            }, error => {
                if (error.data.errorMessages) {
                    that.errorMessages = error.data.errorMessages;
                } else if (error.data.error) {
                    that.errorMessages.push(error.data.error);
                } else {
                    that.errorMessages = ['An error has occurred.'];
                }
            });
        }

        saveSplitEdit (product) {
            this.newProduct = product;
            this.splitEdit = false;
        }

        split () {
            let that = this;
            let splitProduct = {
                oldProduct: this.product,
                newProductName: this.newProduct.name,
                newProductCode: this.newProduct.newProductCode,
                oldVersions: this.versions,
                newVersions: this.movingVersions,
            };
            this.errorMessages = [];
            this.networkService.splitProduct(splitProduct)
                .then(response => {
                    if (!response.status || response.status === 200) {
                        that.$state.go('organizations.developers', {
                            action: undefined,
                            developerId: that.developer.developerId,
                        }, {
                            reload: true,
                        });
                    } else {
                        if (response.data.errorMessages) {
                            that.errorMessages = response.data.errorMessages;
                        } else if (response.data.error) {
                            that.errorMessages.push(response.data.error);
                        } else {
                            that.errorMessages = ['An error has occurred.'];
                        }
                    }
                }, error => {
                    if (error.data.errorMessages) {
                        that.errorMessages = error.data.errorMessages;
                    } else if (error.data.error) {
                        that.errorMessages.push(error.data.error);
                    } else {
                        that.errorMessages = ['An error has occurred.'];
                    }
                });
        }

        takeAction (action) {
            this.action = action;
        }

        takeDeveloperAction () {
            this.$state.go('organizations.developers', {
                action: undefined,
                developerId: this.developer.developerId,
            });
        }

        takeVersionAction (action, versionId) {
            this.$state.go('organizations.developers.products.versions', {
                action: action,
                versionId: versionId,
            });
        }

        takeSplitAction () {
            this.splitEdit = true;
        }

        toggleMerge (product, merge) {
            if (merge) {
                this.mergingProducts.push(this.products.filter(prod => prod.productId === product.productId)[0]);
                this.products = this.products.filter(prod => prod.productId !== product.productId);
            } else {
                this.products.push(this.mergingProducts.filter(prod => prod.productId === product.productId)[0]);
                this.mergingProducts = this.mergingProducts.filter(prod => prod.productId !== product.productId);
            }
        }

        toggleMove (version, toNew) {
            if (toNew) {
                this.movingVersions.push(this.versions.filter(ver => ver.versionId === version.versionId)[0]);
                this.versions = this.versions.filter(ver => ver.versionId !== version.versionId);
            } else {
                this.versions.push(this.movingVersions.filter(ver => ver.versionId === version.versionId)[0]);
                this.movingVersions = this.movingVersions.filter(ver => ver.versionId !== version.versionId);
            }
        }
    },
}

angular.module('chpl.organizations')
    .component('chplProducts', ProductsComponent);
