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
                'Retired': true,
                'Suspended by ONC-ACB': true,
                'Withdrawn by Developer': true,
                'Withdrawn by Developer Under Surveillance/Review': true,
                'Withdrawn by ONC-ACB': true,
                'Suspended by ONC': true,
                'Terminated by ONC': true,
            };
        }

        $onChanges (changes) {
            let that = this;
            if (changes.product) {
                this.product = angular.copy(changes.product.currentValue);
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
            this.product.versions.forEach(v => {
                this.networkService.getProductsByVersion(v.versionId, false).then(listings => v.listings = listings);
            });
            this.activeVersion = this.product.versions[0];
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
