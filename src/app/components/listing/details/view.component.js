const sortCqms = (cqm) => {
  let ret = 0;
  if (cqm.cmsId) {
    ret = parseInt(cqm.cmsId.substring(3), 10);
  } else {
    ret = parseInt(cqm.nqfNumber, 10);
  }
  return ret;
};

const checkC = (cqm, num) => {
  let ret;
  if (angular.isUndefined(cqm[`hasC${num}`])) {
    ret = false;
    if (cqm.criteria) {
      for (let i = 0; i < cqm.criteria.length; i += 1) {
        ret = ret || (cqm.criteria[i].certificationNumber === `170.315 (c)(${num})`);
      }
    }
  } else {
    ret = cqm[`hasC${num}`];
  }
  return ret;
};

const ListingDetailsViewComponent = {
  templateUrl: 'chpl.components/listing/details/view.html',
  bindings: {
    listing: '<',
    hideDirectReview: '<',
    initialPanel: '@',
    isConfirming: '<',
    resources: '<',
    viewAllCerts: '<defaultAll',
  },
  controller: class ListingDetailsViewComponent {
    constructor($analytics, $log, $uibModal, DateUtil, networkService, utilService) {
      this.$analytics = $analytics;
      this.$log = $log;
      this.$uibModal = $uibModal;
      this.DateUtil = DateUtil;
      this.networkService = networkService;
      this.utilService = utilService;
      this.muuCount = utilService.muuCount;
      this.sortCerts = utilService.sortCert;
      this.sortCqms = sortCqms;
      this.viewAllCerts = false;
      this.panelShown = 'cert';
    }

    $onInit() {
      if (this.initialPanel) {
        if (this.initialPanel !== 'none') {
          if (this.initialPanel === 'surveillance' || this.initialPanel === 'directReviews') {
            this.panelShown = 'compliance';
            this.subPanelShown = this.initialPanel;
          } else {
            this.panelShown = this.initialPanel;
          }
        } else {
          this.panelShown = undefined;
        }
      }
    }

    $onChanges(changes) {
      if (changes.listing && changes.listing.currentValue) {
        this.listing = angular.copy(changes.listing.currentValue);
        this.countCerts = this.listing.certificationResults.filter((cr) => cr.success).length;
        this.countCqms = this.listing.cqmResults.filter((cqm) => cqm.success).length;
        this.cqms = this.listing.cqmResults;
        if (this.listing.promotingInteroperabilityUserHistory?.length > 0) {
          const currentPI = this.listing.promotingInteroperabilityUserHistory.sort((a, b) => (a.userCountDate < b.userCountDate ? 1 : -1))[0];
          this.currentPI = {
            ...currentPI,
            userCountDate: this.DateUtil.getDisplayDateFormat(currentPI.userCountDate),
          };
        }
        this.prepCqms();
      }
    }

    prepCqms() {
      if (this.cqms) {
        this.cqms = this.cqms.map((cqm, idx) => {
          const newCqm = {
            ...cqm,
            id: idx,
          };
          for (let j = 1; j < 5; j += 1) {
            newCqm[`hasC${j}`] = checkC(newCqm, j);
          }
          newCqm.allVersions.sort((a, b) => {
            const aVal = parseInt(a.substring(1), 10);
            const bVal = parseInt(b.substring(1), 10);
            return aVal - bVal;
          });
          newCqm.successVersions.sort((a, b) => {
            const aVal = parseInt(a.substring(1), 10);
            const bVal = parseInt(b.substring(1), 10);
            return aVal - bVal;
          });
          return newCqm;
        });
      }
    }

    showPanel(panel) {
      if (this.panelShown !== panel) {
        switch (panel) {
          case 'cert':
            this.$analytics.eventTrack('Viewed Criteria', { category: 'Listing Details', label: this.listing.chplProductNumber });
            break;
          case 'cqm':
            this.$analytics.eventTrack('Viewed CQM Details', { category: 'Listing Details', label: this.listing.chplProductNumber });
            break;
          case 'additional':
            this.$analytics.eventTrack('Viewed additional information', { category: 'Listing Details', label: this.listing.chplProductNumber });
            break;
          case 'compliance':
            this.$analytics.eventTrack('Viewed Compliance information', { category: 'Listing Details', label: this.listing.chplProductNumber });
            break;
          case 'surveillance':
            this.$analytics.eventTrack('Viewed Surveillance information', { category: 'Listing Details', label: this.listing.chplProductNumber });
            break;
          case 'g1g2':
            this.$analytics.eventTrack('Viewed G1/G2 information', { category: 'Listing Details', label: this.listing.chplProductNumber });
            break;
          case 'sed':
            this.$analytics.eventTrack('Viewed SED information', { category: 'Listing Details', label: this.listing.chplProductNumber });
            break;
            // no default
        }
      }

      this.panelShown = this.panelShown === panel ? '' : panel;
    }

    showSubPanel(panel) {
      if (this.subPanelShown !== panel) {
        switch (panel) {
          case 'surveillance':
            this.$analytics.eventTrack('Viewed Surveillance information', { category: 'Listing Details', label: this.listing.chplProductNumber });
            break;
          case 'directReviews':
            this.$analytics.eventTrack('Viewed Direct Review information', { category: 'Listing Details', label: this.listing.chplProductNumber });
            break;
            // no default
        }
      }

      this.subPanelShown = this.subPanelShown === panel ? '' : panel;
    }

    toggleViewAllCerts() {
      if (this.viewAllCerts) {
        this.$analytics.eventTrack('See All Certification Criteria/Clinical Quality Measures', { category: 'Listing Details', label: this.listing.chplProductNumber });
      } else {
        this.$analytics.eventTrack('See Only Certified Certification Criteria/Clinical Quality Measures', { category: 'Listing Details', label: this.listing.chplProductNumber });
      }
    }

    viewIcsFamily() {
      const that = this;
      this.networkService.getIcsFamily(this.listing.id).then((family) => {
        that.uibModalInstance = that.$uibModal.open({
          templateUrl: 'chpl.components/listing/details/ics-family/ics-family-modal.html',
          controller: 'IcsFamilyController',
          controllerAs: 'vm',
          animation: false,
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          resolve: {
            family() { return family; },
            listing() { return that.listing; },
          },
        });
      });
    }
  },
};

angular.module('chpl.components')
  .component('chplListingDetailsView', ListingDetailsViewComponent);

export default ListingDetailsViewComponent;
