export const ReportsComponent = {
  templateUrl: 'chpl.reports/reports.html',
  bindings: {
  },
  controller: class ReportsComponent {
    constructor ($log) {
      'ngInject';
      this.$log = $log;
    }
  },
};

angular.module('chpl.reports')
  .component('chplReports', ReportsComponent);
