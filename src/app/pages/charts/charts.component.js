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
      this.loadCriterionProductCountChart();
      this.loadNonconformityCountChart();
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

    loadCriterionProductCountChart () {
      let that = this;
      this.networkService.getCriterionProductStatistics().then(data => that.criterionProduct = data);
    }

    loadNonconformityCountChart () {
      let that = this;
      this.networkService.getNonconformityStatisticsCount().then(data => that.nonconformityCriteriaCount = data);
    }
  },
};

angular.module('chpl.charts')
  .component('chplCharts', ChartsComponent);
