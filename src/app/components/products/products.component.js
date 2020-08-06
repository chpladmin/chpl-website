export const ProductsComponent = {
    templateUrl: 'chpl.components/products/products.html',
    bindings: {
        developers: '<',
        onCancel: '&?',
        onEdit: '&?',
        products: '<',
        productId: '@',
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
            if (changes.developers) {
                this.developers = changes.developers.currentValue
                    .map(d => {
                        d.displayName = d.name + (d.deleted ? ' - deleted' : ' - active');
                        return d;
                    })
                    .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
            }
            if (changes.products) {
                this.products = changes.products.currentValue.map(p => {
                    p.loaded = false;
                    p.isOpen = false;
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
                this.currentFilter = this.statusItems;
            }
            if (this.products) {
                if (this.productId) {
                    this.activeProduct = this.products
                        .filter(p => p.productId === parseInt(this.productId, 10))
                        .map(p => {
                            p.ownerHistory = p.ownerHistory
                                .filter(o => o.transferDate)
                                .concat({
                                    developer: p.owner,
                                    transferDate: undefined,
                                })
                                .sort((a, b) => {
                                    if (a.transferDate && b.transferDate) {
                                        return b.transferDate - a.transferDate;
                                    }
                                    return a.transferDate ? 1 : -1;
                                })
                            return p;
                        })[0];
                } else {
                    this.products = this.products.map(p => {
                        this.networkService.getVersionsByProduct(p.productId)
                            .then(versions => {
                                p.versions = versions
                                    .sort((a, b) => (a.version < b.version ? -1 : a.version > b.version ? 1 : 0));
                            });
                        return p;
                    });
                }
            }
        }

        cancel () {
            this.onCancel();
        }

        doFilter (items) {
            this.currentFilter = items;
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

        editContact (contact) {
            this.activeProduct.contact = angular.copy(contact);
        }

        generateErrorMessages () {
            let messages = [];
            if (this.activeProduct) {
                if (this.activeProduct.ownerHistory.length < 1) {
                    messages.push('At least one Owner must be recorded');
                }
                if (this.activeProduct.ownerHistory[0].transferDate) {
                    messages.push('Current Developer must be indicated');
                }
                this.activeProduct.ownerHistory.forEach((o, idx, arr) => {
                    if (idx > 0) {
                        if (!o.transferDate) {
                            messages.push('Product may not have two current Owners');
                        }
                        if (arr[idx].developer.name === arr[idx - 1].developer.name) {
                            messages.push('Product cannot transfer from Developer "' + arr[idx].developer.name + '" to the same Developer');
                        }
                    }
                });
            }
            this.errorMessages = messages;
        }

        getListingCounts (product) {
            if (!product.loaded) { return '' }
            let counts = product.versions.reduce((acc, v) => {
                acc.active += v.listings.filter(l => l.certificationStatus === 'Active').length
                acc.total += v.listings.length;
                return acc;
            }, {active: 0, total: 0});
            let ret = '';
            if (counts.active > 0) {
                ret += counts.active + ' active / '
            }
            ret += counts.total + ' listing';
            if (counts.total !== 1) {
                ret += 's';
            }
            return ret;
        }

        isValid () {
            return this.errorMessages.length === 0 // business logic rules
                && this.form.$valid; // form validation
        }

        noVisibleListings (product) {
            return product.activeVersion && product.activeVersion.listings
                .filter(l => l.displayed)
                .length === 0;
        }

        removeOwner (owner) {
            this.activeProduct.ownerHistory = this.activeProduct.ownerHistory
                .filter(o => (!(o.developer.developerId === owner.developer.developerId && o.transferDate === owner.transferDate)));
            this.generateErrorMessages();
        }

        save () {
            let request = angular.copy(this.activeProduct);
            request.owner = request.ownerHistory[0].developer;
            request.ownerHistory = request.ownerHistory.filter(o => o.transferDate);
            this.onEdit({product: request});
        }

        saveNewOwner () {
            this.activeProduct.ownerHistory = this.activeProduct.ownerHistory
                .concat({
                    developer: this.newOwner,
                    transferDate: this.newTransferDate.getTime(),
                })
                .sort((a, b) => {
                    if (a.transferDate && b.transferDate) {
                        return b.transferDate - a.transferDate;
                    }
                    return a.transferDate ? 1 : -1;
                });
            this.newOwner = undefined;
            this.newTransferDate = undefined;
            this.addingOwner = false;
            this.generateErrorMessages();
        }

        takeActionBarAction (action) {
            switch (action) {
            case 'cancel':
                this.cancel();
                break;
            case 'mouseover':
                this.showFormErrors = true;
                this.generateErrorMessages();
                break;
            case 'save':
                this.save();
                break;
                //no default
            }
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
                                    this.doFilter(this.currentFilter);
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
