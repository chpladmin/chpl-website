export const SurveillanceComponent = {
  templateUrl: 'chpl.surveillance/surveillance.html',
  bindings: {
  },
  controller: class SurveillanceComponent {
    constructor ($log) {
      'ngInject';
      this.$log = $log;
    }
  },
};

angular.module('chpl.surveillance')
  .component('chplSurveillance', SurveillanceComponent);
