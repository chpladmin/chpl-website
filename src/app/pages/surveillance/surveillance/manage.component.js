export const SurveillanceManagementComponent = {
    templateUrl: 'chpl.surveillance/surveillance/manage.html',
    bindings: {
        allowedAcbs: '<',
        listings: '<',
    },
    controller: class SurveillanceManagementComponent {
        constructor ($log, $stateParams, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.$stateParams = $stateParams;
            this.networkService = networkService;
            this.certificationStatus = utilService.certificationStatus;
            this.surveillanceProduct = null;
            this.filterItems = {
                pageSize: 50,
                editionItems: [
                    { value: '2011', selected: false },
                    { value: '2014', selected: true },
                    { value: '2015', selected: true },
                ],
                statusItems: [
                    { value: 'Active', selected: true },
                    { value: 'Suspended by ONC', selected: true },
                    { value: 'Suspended by ONC-ACB', selected: true },
                    { value: 'Retired', selected: false },
                    { value: 'Withdrawn by Developer', selected: false },
                    { value: 'Withdrawn by Developer Under Surveillance/Review', selected: false },
                    { value: 'Withdrawn by ONC-ACB', selected: false },
                    { value: 'Terminated by ONC', selected: false },
                ],
            };
            this.clearFilterHs = [];
            this.availableListings = [];
        }

        $onInit () {
            this.listingId = this.$stateParams.listingId;
            if (this.listingId) {
                this.load();
            }
        }

        $onChanges (changes) {
            if (changes.allowedAcbs && changes.allowedAcbs.currentValue && changes.allowedAcbs.currentValue.acbs) {
                this.allowedAcbs = angular.copy(changes.allowedAcbs.currentValue.acbs);
            }
            if (changes.listings && changes.listings.currentValue && changes.listings.currentValue.results) {
                this.listings = angular.copy(changes.listings.currentValue.results);
            }
            if (this.allowedAcbs && this.listings) {
                this.parse();
            }
        }

        parse () {
            this.availableListings = this.listings
                .filter(l => this.hasPermission(l))
                .map(l => {
                    l.mainSearch = [l.developer, l.product, l.version, l.chplProductNumber].join('|');
                    l.surveillance = angular.toJson({
                        openSurveillanceCount: l.openSurveillanceCount,
                        closedSurveillanceCount: l.closedSurveillanceCount,
                        openNonconformityCount: l.openNonconformityCount,
                        closedNonconformityCount: l.closedNonconformityCount,
                        surveillanceDates: l.surveillanceDates,
                    });
                    return l;
                });
        }

        hasPermission (listing) {
            return this.allowedAcbs.reduce((acc, acb) => acc || acb.name === listing.acb, false);
        }

        load () {
            let that = this;
            this.networkService.getListing(this.listingId, true)
                .then(result => that.surveillanceProduct = result);
        }

        registerClearFilter (handler) {
            let that = this;
            this.clearFilterHs.push(handler);
            let removeHandler = () => {
                that.clearFilterHs = that.clearFilterHs.filter(h => h !== handler);
            };
            return removeHandler;
        }

        triggerClearFilters () {
            this.clearFilterHs.forEach(h => h());
            if (this.tableSearchHs && this.tableSearchHs[0]) {
                this.tableSearchHs[0]();
            }
        }

        registerSearch (handler) {
            let that = this;
            this.tableSearchHs = [handler];
            let removeHandler = () => {
                that.tableSearchHs = that.tableSearchHs.filter(h => h !== handler);
            };
            return removeHandler;
        }

        isCategoryChanged () {
            let changed = false;
            angular.forEach(this.categoryChanged, v => changed = changed || v);
            return changed;
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceManagement', SurveillanceManagementComponent);
