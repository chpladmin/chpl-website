export const VersionsComponent = {
    templateUrl: 'chpl.organizations/developers/products/versions/versions.html',
    bindings: {
        developer: '<',
        product: '<',
        version: '<',
        versions: '<',
        listings: '<',
    },
    controller: class VersionsComponent {
        constructor ($log, $state, $stateParams, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.backup = {};
            this.splitEdit = true;
            this.movingListings = [];
            this.validState = true;
        }

        $onChanges (changes) {
            this.action = this.$stateParams.action;
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
            if (changes.product) {
                this.product = angular.copy(changes.product.currentValue);
            }
            if (changes.version) {
                this.version = angular.copy(changes.version.currentValue);
                this.newVersion = angular.copy(this.version);
                this.backup.version = angular.copy(this.version);
            }
            if (changes.versions) {
                this.versions = changes.versions.currentValue.filter(v => v.versionId !== this.version.versionId);
                this.mergingVersions = changes.versions.currentValue.filter(v => v.versionId === this.version.versionId);
                this.backup.versions = angular.copy(this.versions);
                this.backup.mergingVersions = angular.copy(this.mergingVersions);
            }
            if (changes.listings) {
                this.listings = changes.listings.currentValue.map(l => l);
                this.backup.listings = angular.copy(this.listings);
            }
            if (this.mergingVersions && this.version) {
                this.validState = this.mergingVersions.reduce((acc, v) => acc || v.versionId === this.version.versionId, false);
            }
        }

        can (action) {
            if (action === 'split-version' && this.listings.length < 2) { return false; } // cannot split version without at least two listings
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) { return true; } // can do everything
            if (action === 'merge') { return false; } // if not above roles, can't merge
            return this.developer.status.status === 'Active' && this.hasAnyRole(['ROLE_ACB']); // must be active
        }

        cancel () {
            this.version = angular.copy(this.backup.version);
            this.newVersion = angular.copy(this.backup.version);
            this.versions = angular.copy(this.backup.versions);
            this.listings = angular.copy(this.backup.listings);
            this.mergingVersions = angular.copy(this.backup.mergingVersions);
            this.movingListings = [];
            this.action = undefined;
            this.splitEdit = true;
        }

        cancelSplitEdit () {
            this.newVersion = angular.copy(this.version);
            this.splitEdit = false;
        }

        save (version) {
            let versionIds = [];
            if (this.action === 'merge') {
                versionIds = versionIds.concat(this.mergingVersions.map(ver => ver.versionId));
            } else {
                versionIds.push(this.version.versionId);
            }
            let that = this;
            this.version = version;
            this.errorMessages = [];
            this.networkService.updateVersion({
                version: this.version,
                versionIds: versionIds,
                newProductId: this.product.productId,
            }).then(response => {
                if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                    if (that.action === 'merge') {
                        that.$state.go('organizations.developers.products.versions', {
                            action: undefined,
                            developerId: that.developer.developerId,
                            productId: that.product.productId,
                            versionId: response.versionId,
                        });
                    }
                    that.version = response;
                    that.backup.version = angular.copy(response);
                    that.newVersion = angular.copy(response);
                    that.action = undefined;
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

        saveSplitEdit (version) {
            this.newVersion = version;
            this.splitEdit = false;
        }

        split () {
            let that = this;
            let splitVersion = {
                oldVersion: this.version,
                newVersionVersion: this.newVersion.version,
                newVersionCode: this.newVersion.newVersionCode,
                oldListings: this.listings,
                newListings: this.movingListings,
            };
            this.$log.info(splitVersion);
            this.errorMessages = [];
            this.networkService.splitVersion(splitVersion)
                .then(response => {
                    if (!response.status || response.status === 200) {
                        that.$state.go('organizations.developers.products', {
                            action: undefined,
                            developerId: that.developer.developerId,
                            productId: that.product.productId,
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

        takeProductAction () {
            this.$state.go('organizations.developers.products', {
                action: undefined,
                productId: this.product.productId,
            });
        }

        takeListingAction (listingId) {
            this.$state.go('listing', {
                id: listingId,
            });
        }

        takeSplitAction () {
            this.splitEdit = true;
        }

        toggleMerge (version, merge) {
            if (merge) {
                this.mergingVersions.push(this.versions.filter(ver => ver.versionId === version.versionId)[0]);
                this.versions = this.versions.filter(ver => ver.versionId !== version.versionId);
            } else {
                this.versions.push(this.mergingVersions.filter(ver => ver.versionId === version.versionId)[0]);
                this.mergingVersions = this.mergingVersions.filter(ver => ver.versionId !== version.versionId);
            }
        }

        toggleMove (listing, toNew) {
            if (toNew) {
                this.movingListings.push(this.listings.filter(lst => lst.id === listing.id)[0]);
                this.listings = this.listings.filter(lst => lst.id !== listing.id);
            } else {
                this.listings.push(this.movingListings.filter(lst => lst.id === listing.id)[0]);
                this.movingListings = this.movingListings.filter(lst => lst.id !== listing.id);
            }
        }
    },
}

angular.module('chpl.organizations')
    .component('chplVersions', VersionsComponent);
