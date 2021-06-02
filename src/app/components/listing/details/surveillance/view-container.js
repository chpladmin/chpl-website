export const SurveillanceViewContainerComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/view-container.html',
  bindings: {
    resolve: '<',
    dismiss: '&',
  },
  controller: class SurveillanceViewContainerController {
    constructor($log) {
      'ngInject';

      this.$log = $log;
    }

    $onChanges(changes) {
      this.surveillance = angular.copy(changes.resolve.currentValue.surveillance);
    }
  },
};

angular
  .module('chpl.components')
  .component('chplSurveillanceViewContainerComponent', SurveillanceViewContainerComponent);

export default SurveillanceViewContainerComponent;
