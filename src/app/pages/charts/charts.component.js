export const ChartsComponent = {
  templateUrl: 'chpl.charts/charts.html',
  bindings: {
  },
  controller: class ChartsComponent {
    constructor ($analytics, $log, networkService) {
      'ngInject';
      this.$analytics = $analytics;
      this.$log = $log;
      this.networkService = networkService;
    }

    $onInit () {
      this.chartState = {
        tab: 'product',
      };
      this.loadNonconformityCountChart();
      this.loadUniquProductsReportUrl();
    }

    changeTab (target) {
      this.chartState.tab = target;
      let title;
      switch (target) {
      case 'product': title = 'Unique Product'; break;
      case 'nonconformity': title = 'Non-conformity'; break;
        //no default
      }
      this.$analytics.eventTrack('Switch to ' + title + ' Charts', { category: 'Charts' });
    }

    ////////////////////////////////////////////////////////////////////
    loadUniquProductsReportUrl () {
      let that = this;
      this.networkService.getReportUrl('UniqueProducts').then(data => that.uniqueProductsReportUrl = data.reportUrl);

    }

    loadNonconformityCountChart () {
      let that = this;
      this.networkService.getNonconformityStatisticsCount().then(data => that.nonconformityCriteriaCount = data);
    }
  },
};

angular.module('chpl.charts')
  .component('chplCharts', ChartsComponent);
