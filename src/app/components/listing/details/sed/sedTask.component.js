const SedTaskComponent = {
  templateUrl: 'chpl.components/listing/details/sed/sedTask.html',
  bindings: {
    listing: '<',
  },
  controller: class SedTaskComponent {
    constructor($stateParams) {
      'ngInject';

      this.$stateParams = $stateParams;
    }

    $onInit() {
      this.sedTaskId = this.$stateParams.sedTaskId;
    }

    $onChanges(changes) {
      if (changes.listing) {
        this.listing = changes.listing.currentValue;
      }
    }
  },
};

angular
  .module('chpl.components')
  .component('chplListingSedTaskView', SedTaskComponent);

export default SedTaskComponent;
