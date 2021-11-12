const SurveillanceActivityReportingComponent = {
  templateUrl: 'chpl.surveillance/surveillance/reporting.html',
  bindings: {
  },
  controller: class SurveillanceActivityReportingComponent {
    constructor($log) {
      'ngInject';

      this.$log = $log;
    }
  },
};

angular.module('chpl.surveillance')
  .component('chplSurveillanceActivityReporting', SurveillanceActivityReportingComponent);

export default SurveillanceActivityReportingComponent;
