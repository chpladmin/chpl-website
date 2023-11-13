const ListingEditComponent = {
  template: `<ui-view>
  <chpl-listing-edit-page-bridge
    id="$ctrl.id"
    ></chpl-listing-edit-page-bridge>
</ui-view>
`,
  controller: class ListingEditComponent {
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
  .component('chplListingEditFlagged', ListingEditComponent);

export default ListingEditComponent;
