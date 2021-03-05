export const ConfirmListingsComponent = {
  templateUrl: 'chpl.administration/confirm/listings.html',
  bindings: {
    developers: '<',
    resources: '<',
    uploadingCps: '<',
    uploadedListings: '<',
  },
  controller: class ConfirmListingsComponent {
    constructor ($log, $scope, $state, $uibModal, DateUtil, authService, featureFlags, networkService) {
      'ngInject';
      this.$log = $log;
      this.$scope = $scope;
      this.$state = $state;
      this.$uibModal = $uibModal;
      this.DateUtil = DateUtil;
      this.featureFlags = featureFlags;
      this.networkService = networkService;
      this.hasAnyRole = authService.hasAnyRole;
      this.massReject = {};
      this.handleProcess = this.handleProcess.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
    }

    $onChanges (changes) {
      if (changes.developers) {
        this.developers = angular.copy(changes.developers.currentValue);
      }
      if (changes.resources) {
        this.resources = angular.copy(changes.resources.currentValue);
        if (Array.isArray(this.resources)) {
          let resObj = {};
          this.resources.forEach(item => {
            Object.assign(resObj, item);
          });
          this.resources = resObj;
        }
      }
      if (changes.uploadingCps) {
        this.uploadingCps = angular.copy(changes.uploadingCps.currentValue);
      }
      if (changes.uploadedListings) {
        this.uploadedListings = angular.copy(changes.uploadedListings.currentValue);
      }
    }

    getNumberOfListingsToReject () {
      var ret = 0;
      angular.forEach(this.massReject, value => {
        if (value) {
          ret += 1;
        }
      });
      return ret;
    }

    handleProcess (listingId) {
      this.$state.go('.listing', {id: listingId});
    }

    handleUpdate () {
      this.onChange();
    }

    inspectCp (cpId) {
      let that = this;

      this.modalInstance = this.$uibModal.open({
        templateUrl: 'chpl.components/listing/inspect/inspect.html',
        controller: 'InspectController',
        controllerAs: 'vm',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        resolve: {
          beta: () => false,
          developers: () => that.developers,
          inspectingCp: () => that.networkService.getPendingListingById(cpId),
          isAcbAdmin: () => that.hasAnyRole(['ROLE_ACB']),
          isChplAdmin: () => that.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']),
          resources: () => that.resources,
        },
        size: 'lg',
      });
      this.modalInstance.result.then(result => {
        if (result.status === 'confirmed' || result.status === 'rejected' || result.status === 'resolved') {
          if (result.developerCreated) {
            this.developers.push(result.developer);
          }
          this.clearPendingListing(cpId);
          this.onChange();
          if (result.status === 'resolved') {
            this.uploadedListingsMessages = ['Product with ID: "' + result.objectId + '" has already been resolved by "' + result.contact.fullName + '"'];
          }
        }
      });
    }

    inspectListing (listingId) {
      this.$state.go('.listing', {id: listingId});
    }

    massRejectPendingListings () {
      let that = this;
      var idsToReject = [];
      angular.forEach(this.massReject, (value, key) => {
        if (value) {
          idsToReject.push(parseInt(key));
          this.clearPendingListing(parseInt(key));
          delete(this.massReject[key]);
        }
      });
      this.networkService.massRejectPendingListings(idsToReject)
        .then(() => {
          that.onChange();
        }, error => {
          that.onChange();
          if (error.data.errors && error.data.errors.length > 0) {
            that.uploadedListingsMessages = error.data.errors.map(error => 'Product with ID: "' + error.objectId + '" has already been resolved by "' + error.contact.fullName + '"');
          }
        });
    }

    onChange () {
      let that = this;
      this.networkService.getPendingListings(true).then(listings => {
        that.uploadedListings = angular.copy(listings);
      });
    }

    clearPendingListing (cpId) {
      this.uploadingCps = this.uploadingCps.filter(l => l.id !== cpId);
    }
  },
};

angular.module('chpl.administration')
  .component('chplConfirmListings', ConfirmListingsComponent);
