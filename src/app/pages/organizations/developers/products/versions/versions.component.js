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
                this.backup.version = angular.copy(this.version);
            }
            if (changes.versions) {
                this.versions = changes.versions.currentValue.filter(v => v.versionId !== this.version.versionId);
                this.mergingVersions = changes.versions.currentValue.filter(v => v.versionId === this.version.versionId);
                this.backup.versions = angular.copy(this.versions);
                this.backup.mergingVersions = angular.copy(this.mergingVersions);
            }
            if (changes.listings) {
                this.listings = angular.copy(changes.listings.currentValue);
            }
        }

        can (action) {
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) { return true; } // can do everything
            if (action === 'merge') { return false; } // if not above roles, can't merge
            return this.developer.status.status === 'Active' && this.hasAnyRole(['ROLE_ACB']); // must be active
        }

        cancel () {
            this.version = angular.copy(this.backup.version);
            this.versions = angular.copy(this.backup.versions);
            this.mergingVersions = angular.copy(this.backup.mergingVersions);
            this.action = undefined;
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
            this.networkService.updateVersion({
                version: this.version,
                versionIds: versionIds,
                newProductId: this.product.productId,
            }).then(response => {
                if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                    if (that.action === 'merge') {
                        that.$state.go('organizations.developers', {
                            action: undefined,
                            developerId: that.developer.developerId,
                        });
                    }
                    that.version = response;
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

        takeAction (action) {
            this.cancel();
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
            this.$state.go('listiing', {
                id: listingId,
            });
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
    },
}

angular.module('chpl.organizations')
    .component('chplVersions', VersionsComponent);
