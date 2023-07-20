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
        this.id = this.$stateParams.id;
      }
    }
  },
};

angular.module('chpl.listing')
  .component('chplListing', ListingComponent);

export default ListingComponent;
