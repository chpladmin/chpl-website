export const ProductComponent = {
    templateUrl: 'chpl.components/product/product.html',
    bindings: {
        product: '<',
        searchOptions: '<',
    },
    controller: class ProductComponent {
        constructor ($log, $uibModal, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.networkService = networkService;
            this.listingsRetrieved = false;
            this.statusFont = utilService.statusFont;
            this.defaultRefine = {
                'Active': true,
                'Retired': false,
                'Suspended by ONC-ACB': true,
                'Withdrawn by Developer': false,
                'Withdrawn by Developer Under Surveillance/Review': false,
                'Withdrawn by ONC-ACB': false,
                'Suspended by ONC': true,
                'Terminated by ONC': false,
            };
        }

        $onChanges (changes) {
            let that = this;
            if (changes.product) {
                this.product = angular.copy(changes.product.currentValue);
                this.product.ownerHistory = this.product.ownerHistory.map(o => {
                    o.transferDateObject = new Date(o.transferDate);
                    return o;
                });
                this.networkService.getVersionsByProduct(this.product.productId)
                    .then(versions => {
                        that.versions = versions
                            .sort((a, b) => (a.version < b.version ? -1 : a.version > b.version ? 1 : 0));
                        that.activeVersion = that.versions[0];
                    });
            }
            if (changes.searchOptions && changes.searchOptions.currentValue && changes.searchOptions.currentValue.certificationStatuses) {
                this.statusItems = changes.searchOptions.currentValue.certificationStatuses
                    .map(cs => {
                        let status = {
                            value: cs.name,
                            selected: that.defaultRefine[cs.name],
                        }
                        return status;
                    })
                    .sort((a, b) => (a.value < b.value ? -1 : a.value > b.value ? 1 : 0));
            }
        }

        retrieveListings () {
            if (!this.listingsRetrieved) {
                this.listingsRetrieved = true;
                this.versions = this.versions
                    .map(v => {
                        this.networkService.getProductsByVersion(v.versionId, false).then(listings => v.listings = listings);
                        return v;
                    });
            }
        }

        viewCertificationStatusLegend () {
            this.viewCertificationStatusLegendInstance = this.$uibModal.open({
                templateUrl: 'chpl.components/certification-status/certification-status.html',
                controller: 'CertificationStatusController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
            });
            this.viewCertificationStatusLegendInstance.result.then(() => {
                angular.noop;
            }, () => {
                angular.noop;
            });
        }
    },
}

angular.module('chpl.components')
    .component('chplProduct', ProductComponent);
