const SurveillanceManagementReportingComponent = {
  templateUrl: 'chpl.surveillance/surveillance/reporting.html',
  bindings: {
  },
  controller: class SurveillanceManagementReportingComponent {
    constructor($log) {
      'ngInject';

      this.$log = $log;
    }
  },
};

angular.module('chpl.surveillance')
  .component('chplSurveillanceManagementReporting', SurveillanceManagementReportingComponent);

export default SurveillanceManagementReportingComponent;
