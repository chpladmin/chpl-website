export const DeveloperSplitComponent = {
    templateUrl: 'chpl.admin/components/certifiedProduct/developer/split.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&',
    },
    controller: class DeveloperSplitController {
        constructor ($log, $uibModal, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
        }

        $onInit () {
            this.developer = angular.copy(this.resolve.developer);
            this.products = angular.copy(this.resolve.products);
            this.networkService.getAcbs(true)
                .then(response => this.acbs = response.acbs);
            this.productsToMoveToNew = [];
            this.productsToMoveToOld = [];
            this.splitDeveloper = {
                newProducts: [],
                newDeveloper: {},
                oldDeveloper: this.resolve.developer,
                oldProducts: this.resolve.products,
            };
        }

        cancel () {
            this.dismiss();
        }

        moveToNew () {
            for (var i = 0; i < this.productsToMoveToNew.length; i++) {
                this.splitDeveloper.newProducts.push(angular.copy(this.productsToMoveToNew[i]));
                for (var j = 0; j < this.splitDeveloper.oldProducts.length; j++) {
                    if (this.productsToMoveToNew[i] === this.splitDeveloper.oldProducts[j]) {
                        this.splitDeveloper.oldProducts.splice(j,1);
                    }
                }
            }
            this.productsToMoveToNew = [];
            this.$log.info(this.splitDeveloper);
        }

        moveToOld () {
            for (var i = 0; i < this.productsToMoveToOld.length; i++) {
                this.splitDeveloper.oldProducts.push(angular.copy(this.productsToMoveToOld[i]));
                for (var j = 0; j < this.splitDeveloper.newProducts.length; j++) {
                    if (this.productsToMoveToOld[i] === this.splitDeveloper.newProducts[j]) {
                        this.splitDeveloper.newProducts.splice(j,1);
                    }
                }
            }
            this.versionsToMoveToOld = [];
            this.$log.info(this.splitDeveloper);
        }

        save () {
            let that = this;

            this.networkService.splitDeveloper(this.splitDeveloper)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        that.close({
                            //product: response.oldProduct,
                            //versions: vm.splitProduct.oldVersions,
                            //newProduct: response.newProduct,
                        });
                    } else {
                        that.errorMessage = response.data.error;
                    }
                },function (error) {
                    that.errorMessage = error.data.errorMessages[0];
                });
        }
    },
}

angular
    .module('chpl.admin')
    .component('aiDeveloperSplit', DeveloperSplitComponent);
