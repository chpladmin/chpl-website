const ChartsProductComponent = {
  templateUrl: 'chpl.charts/product/product.html',
  bindings: {
    uniqueProductsReportUrl: '<',
  },
  controller: class ChartsProductComponent {
    constructor($analytics, $log, $sce, utilService) {
      'ngInject';

      this.$analytics = $analytics;
      this.$log = $log;
      this.$sce = $sce;
      this.utilService = utilService;
    }

    $onChanges(changes) {
      if (changes.uniqueProductsReportUrl) {
        this.uniqueProductsReportUrl = changes.uniqueProductsReportUrl.currentValue;
      }
    }

    getTrustedSrc(url) {
      return this.$sce.trustAsResourceUrl(url);
    }
  },
};

angular.module('chpl.charts')
  .component('chplChartsProduct', ChartsProductComponent);

export default ChartsProductComponent;
