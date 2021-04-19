export const ConfirmListingsComponent = {
  templateUrl: 'chpl.administration/confirm/listings.html',
  bindings: {
    developers: '<',
    resources: '<',
    uploadingCps: '<',
  },
  controller: class ConfirmListingsComponent {
    constructor ($log, $scope, $state, $timeout, $uibModal, DateUtil, authService, featureFlags, networkService) {
      'ngInject';
      this.$log = $log;
      this.$scope = $scope;
      this.$state = $state;
      this.$timeout = $timeout;
      this.$uibModal = $uibModal;
      this.DateUtil = DateUtil;
      this.featureFlags = featureFlags;
      this.networkService = networkService;
      this.hasAnyRole = authService.hasAnyRole;
      this.massReject = {};
      this.handleProcess = this.handleProcess.bind(this);
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
          that.loadListings();
        }, error => {
          that.loadListings();
          if (error.data.errors && error.data.errors.length > 0) {
            that.uploadedListingsMessages = error.data.errors.map(error => 'Product with ID: "' + error.objectId + '" has already been resolved by "' + error.contact.fullName + '"');
          }
        });
    }

    loadListings () {
      let that = this;
      this.networkService.getPendingListings().then(response => {
        that.uploadingCps = response;
      });
    }

    clearPendingListing (cpId) {
      this.uploadingCps = this.uploadingCps.filter(l => l.id !== cpId);
    }
  },
};

angular.module('chpl.administration')
  .component('chplConfirmListings', ConfirmListingsComponent);
