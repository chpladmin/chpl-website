export const ProductsComponent = {
    templateUrl: 'chpl.components/product/products.html',
    bindings: {
        products: '<',
        searchOptions: '<',
    },
    controller: class ProductsComponent {
        constructor ($log, $uibModal, $q, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.networkService = networkService;
            this.statusFont = utilService.statusFont;
            this.defaultRefine = {
                'Active': true,
                'Retired': false,
                'Suspended by ONC-ACB': true,
                'Withdrawn by Developer': true,
                'Withdrawn by Developer Under Surveillance/Review': true,
                'Withdrawn by ONC-ACB': true,
                'Suspended by ONC': true,
                'Terminated by ONC': true,
            };
        }

        $onChanges (changes) {
            if (changes.products) {
                this.products = changes.products.currentValue.map(p => {
                    p.loaded = false;
                    p.ownerHistory = p.ownerHistory.map(o => {
                        o.transferDateObject = new Date(o.transferDate);
                        return o;
                    });
                    this.networkService.getVersionsByProduct(p.productId)
                        .then(versions => {
                            p.versions = versions
                                .sort((a, b) => (a.version < b.version ? -1 : a.version > b.version ? 1 : 0));
                        });
                    return p;
                });
            }
            if (changes.searchOptions && changes.searchOptions.currentValue && changes.searchOptions.currentValue.certificationStatuses) {
                this.statusItems = changes.searchOptions.currentValue.certificationStatuses
                    .map(cs => {
                        let status = {
                            value: cs.name,
                            selected: this.defaultRefine[cs.name],
                        }
                        return status;
                    })
                    .sort((a, b) => (a.value < b.value ? -1 : a.value > b.value ? 1 : 0));
            }
        }

        doFilter (items) {
            this.products.forEach(p => {
                p.versions.forEach(v => {
                    if (v.listings) {
                        v.listings.forEach(l => {
                            l.displayed = items.find(i => i.value === l.certificationStatus).selected;
                        });
                    }
                });
            });
        }

        toggleProduct (product) {
            this.products = this.products
                .map(p => {
                    if (p.productId === product.productId) {
                        if (!p.loaded) {
                            let promises = p.versions.map(v => this.networkService.getProductsByVersion(v.versionId, false).then(listings => v.listings = listings));
                            this.$q.all(promises)
                                .then(() => {
                                    p.activeVersion = p.versions[0];
                                    p.loaded = true;
                                    p.isOpen = !p.isOpen;
                                });
                        } else {
                            p.isOpen = !p.isOpen;
                        }
                    }
                    return p;
                });
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
    .component('chplProducts', ProductsComponent);
