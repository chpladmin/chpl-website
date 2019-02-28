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
            this.attestations = {};
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
            this.productsToMoveToOld = [];
        }

        attestationChange () {
            let that = this;
            var mappedAttestations = [];
            this.$log.info(this.attestations);
            angular.forEach(this.attestations, function (value, key) {
                let acb = that.acbs.find(function (acb) {
                    return acb.id === parseInt(key, 10);
                });
                if (acb) {
                    mappedAttestations.push({acbId: acb.id, acbName: acb.name, attestation: value});
                }
            });
            this.$log.info(mappedAttestations);
            this.splitDeveloper.newDeveloper.transparencyAttestations = mappedAttestations;
        }

        save () {
            let that = this;

            this.networkService.splitDeveloper(this.splitDeveloper)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        that.close({
                            $value: that.splitDeveloper,
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
    .module('chpl.admin')
    .component('aiDeveloperSplit', DeveloperSplitComponent);
