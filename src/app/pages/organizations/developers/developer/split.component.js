export const DevelopersSplitComponent = {
    templateUrl: 'chpl.organizations/developers/developer/split.html',
    bindings: {
        developer: '<',
    },
    controller: class DevelopersSplitController {
        constructor ($log, $state, authService, networkService, toaster) {
            'ngInject';
            this.$log = $log;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.toaster = toaster;
            this.movingProducts = [];
            this.newDeveloper = {
                status: {status: 'Active'},
                statusEvents: [{
                    status: { status: 'Active'},
                    statusDate: new Date(),
                }],
            };
        }

        $onInit () {
            this.networkService.getAcbs(true)
                .then(response => this.acbs = response.acbs);
        }

        $onChanges (changes) {
            if (changes.developer && changes.developer.currentValue) {
                this.developer = angular.copy(changes.developer.currentValue);
                this.products = angular.copy(this.developer.products);
            }
        }

        cancel () {
            this.$state.go('organizations.developers.developer', {
                developerId: this.developer.developerId,
            }, {
                reload: true,
            });
        }

        split (developer) {
            let splitDeveloper = {
                oldDeveloper: this.developer,
                newDeveloper: developer,
                oldProducts: this.products,
                newProducts: this.movingProducts,
            };
            this.errorMessages = [];
            let that = this;
            this.networkService.splitDeveloper(splitDeveloper)
                .then(response => {
                    if (!response.status || response.status === 200) {
                        that.toaster.pop({
                            type: 'success',
                            title: 'Split submitted',
                            body: 'Your action has been submitted and you\'ll get an email at ' + response.job.jobDataMap.user.email + ' when it\'s done',
                        });
                        that.$state.go('organizations.developers', {}, {
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
    },
};

angular
    .module('chpl.organizations')
    .component('chplDevelopersSplit', DevelopersSplitComponent);
