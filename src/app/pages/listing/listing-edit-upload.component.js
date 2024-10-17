const ListingEditUploadComponent = {
  template: `<ui-view>
  <chpl-listing-edit-upload-bridge
    id="$ctrl.id"
    ></chpl-listing-edit-upload-bridge>
</ui-view>
`,
  controller: class ListingEditUploadComponent {
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
  .component('chplListingEditUpload', ListingEditUploadComponent);

export default ListingEditUploadComponent;
