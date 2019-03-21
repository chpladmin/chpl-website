export const DevelopersComponent = {
    templateUrl: 'chpl.organizations/developers/developers.html',
    bindings: {
        allowedAcbs: '<',
        developer: '<',
        developers: '<',
        products: '<',
    },
    controller: class DevelopersComponent {
        constructor ($log, $state, $stateParams, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.backup = {};
            this.splitEdit = true;
        }

        $onChanges (changes) {
            this.action = this.$stateParams.action;
            if (changes.allowedAcbs) {
                this.allowedAcbs = (angular.copy(changes.allowedAcbs.currentValue)).acbs;
            }
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
                this.newDeveloper = angular.copy(this.developer);
                this.backup.developer = angular.copy(this.developer);
            }
            if (changes.developers) {
                this.developers = (angular.copy(changes.developers.currentValue)).developers;
                this.backup.developers = angular.copy(this.developers);
                this.mergingDevelopers = [];
            }
            if (changes.products) {
                this.products = (angular.copy(changes.products.currentValue)).products;
                this.backup.products = angular.copy(this.products);
                this.movingProducts = [];
            }
        }

        cancel () {
            this.developer = angular.copy(this.backup.developer);
            this.newDeveloper = angular.copy(this.developer);
            this.developers = angular.copy(this.backup.developers);
            this.products = angular.copy(this.backup.products);
            this.mergingDevelopers = [];
            this.movingProducts = [];
            this.action = undefined;
            this.splitEdit = true;
        }

        cancelSplitEdit () {
            this.newDeveloper = angular.copy(this.developer);
            this.splitEdit = false;
        }

        save (developer) {
            let developerIds = [this.developer.developerId];
            if (this.action === 'merge') {
                developerIds = developerIds.concat(this.mergingDevelopers.map(dev => dev.developerId));
            }
            let that = this;
            this.developer = developer;
            this.networkService.updateDeveloper({
                developer: this.developer,
                developerIds: developerIds,
            }).then(response => {
                if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                    if (that.action === 'merge') {
                        that.$state.go('organizations.developers', {
                            developerId: response.developerId,
                            action: undefined,
                        });
                    }
                    that.developer = response;
                    that.action = undefined;
                } else {
                    if (response.data.errorMessages) {
                        that.errorMessages = response.data.errorMessages;
                    } else if (response.data.error) {
                        that.errorMessages = [];
                        that.errorMessages.push(response.data.error);
                    } else {
                        that.errorMessages = ['An error has occurred.'];
                    }
                }
            }, error => {
                if (error.data.errorMessages) {
                    that.errorMessages = error.data.errorMessages;
                } else if (error.data.error) {
                    that.errorMessages = [];
                    that.errorMessages.push(error.data.error);
                } else {
                    that.errorMessages = ['An error has occurred.'];
                }
            });
        }

        saveSplitEdit (developer) {
            this.newDeveloper = developer;
            this.splitEdit = false;
        }

        split () {
            let that = this;
            let splitDeveloper = {
                oldDeveloper: this.developer,
                newDeveloper: this.newDeveloper,
                oldProducts: this.products,
                newProducts: this.movingProducts,
            };
            this.networkService.splitDeveloper(splitDeveloper)
                .then(response => {
                    if (!response.status || response.status === 200) {
                        that.$state.go('organizations.developers', {
                            developerId: response.oldDeveloper.developerId,
                            action: undefined,
                        });
                    } else {
                        if (response.data.errorMessages) {
                            that.errorMessages = response.data.errorMessages;
                        } else if (response.data.error) {
                            that.errorMessages = [];
                            that.errorMessages.push(response.data.error);
                        } else {
                            that.errorMessages = ['An error has occurred.'];
                        }
                    }
                }, error => {
                    if (error.data.errorMessages) {
                        that.errorMessages = error.data.errorMessages;
                    } else if (error.data.error) {
                        that.errorMessages = [];
                        that.errorMessages.push(error.data.error);
                    } else {
                        that.errorMessages = ['An error has occurred.'];
                    }
                });
        }

        takeAction (action) {
            this.action = action;
        }

        takeProductAction (action, productId) {
            this.$state.go('organizations.developers.products', {
                action: action,
                productId: productId,
            });
        }

        takeSplitAction () {
            this.splitEdit = true;
        }

        toggleMerge (developer, merge) {
            if (merge) {
                this.mergingDevelopers.push(this.developers.filter(dev => dev.developerId === developer.developerId)[0]);
                this.developers = this.developers.filter(dev => dev.developerId !== developer.developerId);
            } else {
                this.developers.push(this.mergingDevelopers.filter(dev => dev.developerId === developer.developerId)[0]);
                this.mergingDevelopers = this.mergingDevelopers.filter(dev => dev.developerId !== developer.developerId);
            }
        }

        toggleMove (product, toNew) {
            if (toNew) {
                this.movingProducts.push(this.products.filter(prod => prod.productId === product.productId)[0]);
                this.products = this.products.filter(prod => prod.productId !== product.productId);
            } else {
                this.products.push(this.movingProducts.filter(prod => prod.productId === product.productId)[0]);
                this.movingProducts = this.movingProducts.filter(prod => prod.productId !== product.productId);
            }
        }
    },
}

angular.module('chpl.organizations')
    .component('chplDevelopers', DevelopersComponent);
