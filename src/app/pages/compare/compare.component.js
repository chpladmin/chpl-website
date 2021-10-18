export const CompareComponent = {
  templateUrl: 'chpl.compare/compare.html',
  controller: class CompareComponent {
    constructor($analytics, $filter, $log, $scope, $stateParams, DateUtil, networkService, utilService) {
      'ngInject';

      this.$analytics = $analytics;
      this.$filter = $filter;
      this.$log = $log;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.DateUtil = DateUtil;
      this.networkService = networkService;
      this.certificationStatus = utilService.certificationStatus;
      this.sortCerts = utilService.sortCert;
      this.sortCqms = utilService.sortCqm;
      this.listings = [];
      this.listingList = [];
      this.allCerts = {};
      this.allCqms = {};
    }

    $onInit() {
      if (this.$stateParams.compareIds) {
        this.compareIds = this.$stateParams.compareIds.split('&');
        this.parse();
      }
    }

    parse() {
      const that = this;
      this.compareIds.forEach((id) => {
        this.networkService.getListing(id)
          .then((listing) => {
            that.updateListingList(listing);
            that.updateCerts(listing);
            that.updateCqms(listing);
            that.fillInBlanks();
            that.sortAllCerts();
            that.sortAllCqms();
            that.listings.push(listing);
          });
      });
    }

    fillInBlanks() {
      let cert; let i; let k; let listing; let
        needToAddBlank;
      for (i = 0; i < this.listingList.length; i++) {
        listing = this.listingList[i];
        for (cert in this.allCerts) {
          needToAddBlank = true;
          for (k = 0; k < this.allCerts[cert].values.length; k++) {
            if (this.allCerts[cert].values[k].listingId === listing.id) {
              needToAddBlank = false;
            }
          }
          if (needToAddBlank) {
            this.allCerts[cert].values.push({
              listingId: listing.id,
              allowed: false,
              certificationDate: listing.certificationDate,
            });
          }
        }
        for (const cqm in this.allCqms) {
          needToAddBlank = true;
          for (k = 0; k < this.allCqms[cqm].values.length; k++) {
            if (this.allCqms[cqm].values[k].listingId === listing.id) {
              needToAddBlank = false;
            }
          }
          if (needToAddBlank) {
            this.allCqms[cqm].values.push({
              listingId: listing.id,
              allowed: false,
              certificationDate: listing.certificationDate,
            });
          }
        }
      }
    }

    isShowing(elem) {
      return this.openCert === elem;
    }

    sortAllCerts() {
      this.sortedCerts = [];
      for (const cert in this.allCerts) {
        this.sortedCerts.push(cert);
      }
      this.sortedCerts = this.$filter('orderBy')(this.sortedCerts, this.sortCerts);
    }

    sortAllCqms() {
      this.sortedCqms = [];
      for (const cqm in this.allCqms) {
        this.sortedCqms.push(cqm);
      }
      this.sortedCqms = this.$filter('orderBy')(this.sortedCqms, this.sortCqms);
    }

    toggle(elem) {
      if (!this.isShowing(elem)) {
        const event = (elem === 'certifications' ? 'View Criteria Details' : 'View CQM Details');
        this.$analytics.eventTrack(event, { category: 'Compare Page' });
      }
      this.openCert = this.openCert === elem ? '' : elem;
    }

    updateCerts(listing) {
      listing.certificationResults.forEach((cert) => {
        const key = `${cert.number}: ${cert.title}`;
        if (!this.allCerts[key]) {
          this.allCerts[key] = {
            number: cert.criterion.number,
            title: cert.criterion.title,
            removed: cert.criterion.removed,
            values: [],
          };
        }
        this.allCerts[key].atLeastOne = this.allCerts[key].atLeastOne || cert.success;
        this.allCerts[key].values.push({
          listingId: listing.id,
          allowed: true,
          success: cert.success,
          certificationDate: listing.certificationDate,
        });
      });
    }

    updateCqms(listing) {
      listing.cqmResults.forEach((cqm) => {
        if (cqm.cmsId) {
          cqm.displayId = cqm.cmsId;
        } else {
          cqm.displayId = `NQF-${cqm.nqfNumber}`;
        }
        const key = cqm.displayId;
        if (!this.allCqms[key]) {
          this.allCqms[key] = {
            displayId: cqm.displayId,
            title: cqm.title,
            values: [],
          };
        }
        this.allCqms[key].atLeastOne = this.allCqms[key].atLeastOne || cqm.success;
        this.allCqms[key].values.push({
          listingId: listing.id,
          allowed: true,
          success: cqm.success,
          certificationDate: listing.certificationDate,
          successVersions: cqm.successVersions,
        });
      });
    }

    updateListingList(listing) {
      this.hasNon2015 = this.hasNon2015 || listing.certificationEdition.name !== '2015';
      this.listingList.push({
        id: listing.id,
        certificationDate: listing.certificationDate,
      });
    }
  },
};

angular.module('chpl.compare')
  .component('chplCompare', CompareComponent);
