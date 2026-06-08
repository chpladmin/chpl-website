const ConfirmListingsComponent = {
  template: `<div class="row" ui-view>
  <div class="col-md-12">
    <chpl-confirm-listings-wrapper-bridge
      on-process="::$ctrl.handleProcess"
    ></chpl-confirm-listings-wrapper-bridge>
  </div>
</div>
`,
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
