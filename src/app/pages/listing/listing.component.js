const ListingComponent = {
  template: `<ui-view>
  <chpl-listing-page-bridge
    id="$ctrl.id"
    ></chpl-listing-page-bridge>
</ui-view>
`,
  controller: class ListingComponent {
    constructor($log, $stateParams) {
      'ngInject';

      this.$log = $log;
      this.$stateParams = $stateParams;
    }

    $onInit() {
      if (this.$stateParams.id) {
        this.id = parseInt(this.$stateParams.id, 10);
      }
    }
  },
};

angular.module('chpl.listing')
  .component('chplListing', ListingComponent);

export default ListingComponent;
