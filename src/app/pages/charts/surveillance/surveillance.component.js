const ChartsSurveillanceComponent = {
  templateUrl: 'chpl.charts/surveillance/surveillance.html',
  bindings: {
    nonconformityCountsReportUrl: '<',
  },
  controller: class ChartsSurveillanceComponent {
    constructor($sce) {
      'ngInject';
      
      this.$sce = $sce;
    }

    $onChanges(changes) {
      if (changes.nonconformityCountsReportUrl) {
        this.nonconformityCountsReportUrl = changes.nonconformityCountsReportUrl.currentValue;
      }
    }

    getTrustedSrc(url) {
      return this.$sce.trustAsResourceUrl(url);
    }
  },
};

angular.module('chpl.charts')
  .component('chplChartsSurveillance', ChartsSurveillanceComponent);

export default ChartsSurveillanceComponent;
