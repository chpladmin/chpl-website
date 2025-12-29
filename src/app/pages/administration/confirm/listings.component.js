const ConfirmListingsComponent = {
  templateUrl: 'chpl.administration/confirm/listings.html',
  bindings: { },
  controller: class ConfirmListingsComponent {
    constructor($log, $state) {
      'ngInject';

      this.$log = $log;
      this.$state = $state;
    }

    $onInit() {
      this.handleProcess = this.handleProcess.bind(this);
    }

    handleProcess(listingId) {
      this.$state.go('.listing', { id: listingId });
    }
  },
};

angular.module('chpl.administration')
  .component('chplConfirmListings', ConfirmListingsComponent);

export default ConfirmListingsComponent;
