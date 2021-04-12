export const ConfirmListingsComponent = {
  templateUrl: 'chpl.administration/confirm/listings.html',
  bindings: {
    developers: '<',
    resources: '<',
  },
  controller: class ConfirmListingsComponent {
    constructor ($log, $state, $uibModal, authService, networkService) {
      'ngInject';
      this.$log = $log;
      this.$state = $state;
      this.$uibModal = $uibModal;
      this.networkService = networkService;
      this.hasAnyRole = authService.hasAnyRole;
    }

    $onInit () {
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
    }

    handleProcess (listingId, beta) {
      if (beta) {
        this.$state.go('.listing', {id: listingId});
      } else {
        this.inspectListing(listingId);
      }
    }

    inspectListing (listingId) {
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
          inspectingCp: () => that.networkService.getPendingListingById(listingId),
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
          if (result.status === 'resolved') {
            this.uploadedListingsMessages = ['Product with ID: "' + result.objectId + '" has already been resolved by "' + result.contact.fullName + '"'];
          }
        }
      });
    }
  },
};

angular.module('chpl.administration')
  .component('chplConfirmListings', ConfirmListingsComponent);
