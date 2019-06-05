export const SurveillanceManagementComponent = {
    templateUrl: 'chpl.surveillance/surveillance/manage.html',
    bindings: {
        allowedAcbs: '<',
        listings: '<',
    },
    controller: class SurveillanceManagementComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
            this.surveillanceProduct = null;
            this.filterItems = {
                pageSize: 50,
            };
            this.clearFilterHs = [];
            this.availableListings = [];
        }

        $onChanges (changes) {
            if (changes.allowedAcbs) {
                this.allowedAcbs = angular.copy(changes.allowedAcbs.currentValue.acbs);
            }
            if (changes.listings) {
                this.listings = angular.copy(changes.listings.currentValue.results);
            }
            if (this.allowedAcbs && this.listings) {
                this.parse();
            }
        }

        parse () {
            this.availableListings = this.listings.filter(l => this.hasPermission(l))
                .map(l => {
                    l.mainSearch = [l.developer, l.product, l.version, l.chplProductNumber].join('|');
                    l.nonconformities = angular.toJson({
                        openNonconformityCount: l.openNonconformityCount,
                        closedNonconformityCount: l.closedNonconformityCount,
                    });
                    return l;
                });
        }

        hasPermission (listing) {
            return this.allowedAcbs.reduce((acc, acb) => acc || acb.name === listing.acb, false);
        }

        loadSurveillance () {
            let that = this;
            this.networkService.getListing(this.productId, true)
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
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceManagement', SurveillanceManagementComponent);
