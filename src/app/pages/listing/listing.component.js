const ListingComponent = {
  templateUrl: 'chpl.listing/listing.html',
  bindings: {
    listing: '<',
  },
  controller: class ListingComponent {
    constructor($localStorage, $log, $q, $state, $stateParams, API, DateUtil, authService, featureFlags, utilService) {
      'ngInject';

      this.$localStorage = $localStorage;
      this.$log = $log;
      this.$q = $q;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.API = API;
      this.DateUtil = DateUtil;
      this.authService = authService;
      this.isOn = featureFlags.isOn;
      this.utilService = utilService;
      this.certificationStatus = utilService.certificationStatus;
      this.hasAnyRole = authService.hasAnyRole;
    }

    $onInit() {
      this.panel = this.$stateParams.panel || 'cert';
    }

    $onChanges(changes) {
      if (changes.listing) {
        this.listing = changes.listing.currentValue;
        this.downloadLink = `${this.API}/listings/${this.listing.id}/uploaded-file?api_key=${this.authService.getApiKey()}`;
        this.chplProductNumberHistory = [...new Set(this.listing.chplProductNumberHistory.map((item) => item.chplProductNumber))]
          .filter((item) => item !== this.listing.chplProductNumber)
          .sort((a, b) => (a < b ? -1 : 1));
        this.backupListing = angular.copy(this.listing);
        if (this.$localStorage.previouslyViewed) {
          this.previouslyViewed = this.$localStorage.previouslyViewed;

          if (this.previouslyViewed.indexOf((`${this.listing.id}`)) === -1) {
            this.previouslyViewed.push((`${this.listing.id}`));
            if (this.previouslyViewed.length > 20) {
              this.previouslyViewed.shift();
            }
            this.$localStorage.previouslyViewed = this.previouslyViewed;
          }
        } else {
          this.$localStorage.previouslyViewed = [`${this.listing.id}`];
        }
      }
    }

    canCertId(listing) {
      return listing.curesUpdate
        || (!this.isOn('cannot-generate-15e') && listing.certificationEdition.name === '2015');
    }

    canEdit() {
      return this.$state.current.name === 'listing'
                && ((this.listing.certificationEdition.name === '2014' && this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']))
                    || (this.listing.certificationEdition.name !== '2014' && this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])));
    }

    canViewRwtDates() {
      if (this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
        return true;
      } if (this.authService.hasAnyRole(['ROLE_ACB'])) {
        const currentUser = this.authService.getCurrentUser();
        return currentUser.organizations
          .filter((o) => o.id === this.listing.certifyingBody.id)
          .length > 0;
      } if (this.authService.hasAnyRole(['ROLE_DEVELOPER'])) {
        const currentUser = this.authService.getCurrentUser();
        return currentUser.organizations
          .filter((d) => d.id === this.listing.developer.id)
          .length > 0;
      }
      return false;
    }

    takeDeveloperAction(action, id) {
      this.$state.go('organizations.developers.developer', {
        id,
      });
    }
  },
};

angular
  .module('chpl.listing')
  .component('chplListing', ListingComponent);

export default ListingComponent;
