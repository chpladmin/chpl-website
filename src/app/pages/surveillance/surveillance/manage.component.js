export const SurveillanceManagementComponent = {
  templateUrl: 'chpl.surveillance/surveillance/manage.html',
  bindings: {
    allowedAcbs: '<',
    listings: '<',
  },
  controller: class SurveillanceManagementComponent {
    constructor($log, $stateParams, authService, networkService, utilService) {
      'ngInject';

      this.$log = $log;
      this.$stateParams = $stateParams;
      this.networkService = networkService;
      this.certificationStatus = utilService.certificationStatus;
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
      this.tabs = [];
      this.activeTab = 0;
    }

    $onInit() {
      if (this.$stateParams.listingId && this.$stateParams.chplProductNumber) {
        this.load({
          id: this.$stateParams.listingId,
          chplProductNumber: this.$stateParams.chplProductNumber,
        });
        this.activeTab = this.$stateParams.listingId;
      }
    }

    $onChanges(changes) {
      if (changes.allowedAcbs && changes.allowedAcbs.currentValue && changes.allowedAcbs.currentValue.acbs) {
        this.allowedAcbs = angular.copy(changes.allowedAcbs.currentValue.acbs);
      }
      if (changes.listings && changes.listings.currentValue && changes.listings.currentValue.results) {
        this.listings = angular.copy(changes.listings.currentValue.results);
      }
      if (this.allowedAcbs && this.listings) {
        this.filterItems.acbItems = this.allowedAcbs
          .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
          .map((a) => {
            const ret = {
              value: a.name,
            };
            if (a.retired) {
              ret.display = `${a.name} (Retired)`;
              ret.retired = true;
              ret.selected = ((new Date()).getTime() - a.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4);
            } else {
              ret.selected = true;
            }
            return ret;
          });
        this.parse();
      }
    }

    parse() {
      this.availableListings = this.listings
        .filter((l) => this.hasPermission(l))
        .map((l) => {
          l.mainSearch = [l.developer, l.product, l.version, l.chplProductNumber].join('|');
          l.edition += (l.curesUpdate ? ' Cures Update' : '');
          l.surveillance = angular.toJson({
            openSurveillanceCount: l.openSurveillanceCount,
            closedSurveillanceCount: l.closedSurveillanceCount,
            openSurveillanceNonConformityCount: l.openSurveillanceNonConformityCount,
            closedSurveillanceNonConformityCount: l.closedSurveillanceNonConformityCount,
            surveillanceDates: l.surveillanceDates,
          });
          return l;
        });
    }

    hasPermission(listing) {
      return this.allowedAcbs.reduce((acc, acb) => acc || acb.name === listing.acb, false);
    }

    isLoaded(listing) {
      return this.tabs.reduce((acc, tab) => acc || tab.id === listing.id, false);
    }

    load(listing) {
      if (!this.isLoaded(listing)) {
        this.tabs.push({
          id: listing.id,
          chplProductNumber: listing.chplProductNumber,
        });
        const that = this;
        this.networkService.getListing(listing.id, true)
          .then((result) => that.tabs.forEach((t) => {
            if (t.id === listing.id) {
              t.listing = result;
            }
          }));
      }
    }

    takeTabAction(action, data, $event) {
      if (action === 'close') {
        this.tabs = this.tabs.filter((t) => t.id !== data.id);
      }
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }
    }

    registerClearFilter(handler) {
      const that = this;
      this.clearFilterHs.push(handler);
      const removeHandler = () => {
        that.clearFilterHs = that.clearFilterHs.filter((h) => h !== handler);
      };
      return removeHandler;
    }

    triggerClearFilters() {
      this.clearFilterHs.forEach((h) => h());
      if (this.tableSearchHs && this.tableSearchHs[0]) {
        this.tableSearchHs[0]();
      }
    }

    registerSearch(handler) {
      const that = this;
      this.tableSearchHs = [handler];
      const removeHandler = () => {
        that.tableSearchHs = that.tableSearchHs.filter((h) => h !== handler);
      };
      return removeHandler;
    }

    isCategoryChanged() {
      let changed = false;
      angular.forEach(this.categoryChanged, (v) => changed = changed || v);
      return changed;
    }
  },
};

angular.module('chpl.surveillance')
  .component('chplSurveillanceManagement', SurveillanceManagementComponent);
