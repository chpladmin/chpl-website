export const DeveloperSplitComponent = {
    templateUrl: 'chpl.organizations/developers/split.html',
    bindings: {
        developer: '<',
        products: '<',
    },
    controller: class DeveloperSplitController {
        constructor ($log, $state, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.movingProducts = [];
            this.attestattions
        }

        $onInit () {
            this.$log.info('$onInit');
            this.networkService.getAcbs(true)
                .then(response => this.acbs = response.acbs);
        }

        $onChanges (changes) {
            this.$log.info('$onChanges', changes);
            if (changes.developer) {
                this.developer = angular.copy(this.changes.developer.currentValue);
                this.newDeveloper = angular.copy(this.changes.developer.currentValue);
            }
            if (changes.products) {
                this.products = angular.copy(this.changes.products.currentValue);
            }
        }

        split () {
            let that = this;
            let splitDeveloper = {
                oldDeveloper: this.developer,
                newDeveloper: this.newDeveloper,
                oldProducts: this.products,
                newProducts: this.movingProducts,
            };
            this.errorMessages = [];
            this.networkService.splitDeveloper(splitDeveloper)
                .then(response => {
                    if (!response.status || response.status === 200) {
                        that.$state.go('organizations.developers', {
                            developerId: response.oldDeveloper.developerId,
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

        toggleMove (product, toNew) {
            if (toNew) {
                this.movingProducts.push(this.products.find(prod => prod.productId === product.productId));
                this.products = this.products.filter(prod => prod.productId !== product.productId);
            } else {
                this.products.push(this.movingProducts.find(prod => prod.productId === product.productId));
                this.movingProducts = this.movingProducts.filter(prod => prod.productId !== product.productId);
            }
        }

        attestationChange () {
            let that = this;
            var mappedAttestations = [];
            angular.forEach(this.attestations, function (value, key) {
                let acb = that.acbs.find(function (acb) {
                    return acb.id === parseInt(key, 10);
                });
                if (acb) {
                    mappedAttestations.push({acbId: acb.id, acbName: acb.name, attestation: value});
                }
            });
            this.splitDeveloper.newDeveloper.transparencyAttestations = mappedAttestations;
        }

        save () {
            let that = this;

            this.networkService.splitDeveloper(this.splitDeveloper)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        that.close({
                            $value: response,
                        });
                    } else {
                        if (response.data.errorMessages) {
                            that.errorMessages = response.data.errorMessages;
                        } else if (response.data.error) {
                            that.errorMessages = [];
                            that.errorMessages.push(response.data.error);
                        }
                    }
                },function (error) {
                    if (error.data.errorMessages) {
                        that.errorMessages = error.data.errorMessages;
                    } else if (error.data.error) {
                        that.errorMessages = [];
                        that.errorMessages.push(error.data.error);
                    }
                });
        }
    },
}

angular
    .module('chpl.organizations')
    .component('chplDeveloperSplit', DeveloperSplitComponent);
