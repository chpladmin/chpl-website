import { sortCriteria } from 'services/criteria.service';

export const ChartsProductComponent = {
  templateUrl: 'chpl.charts/product/product.html',
  bindings: {
    criterionProduct: '<',
  },
  controller: class ChartsProductComponent {
    constructor ($analytics, $log, utilService) {
      'ngInject';
      this.$analytics = $analytics;
      this.$log = $log;
      this.utilService = utilService;
    }

    $onChanges (changes) {
      if (changes.criterionProduct) {
        this._createCriterionProductCountChart(changes.criterionProduct.currentValue);
      }
    }

    _createCriterionProductCountChart (data) {
      this.criterionProductCounts = {
        type: 'BarChart',
        data: {
          cols: [
            { label: 'Certification Criteria', type: 'string'},
            { label: 'Number of Unique Products', type: 'number'},
            { type: 'string', role: 'tooltip'},
          ],
          rows: this._getCriterionProductCountDataInChartFormat(data),
        },
        options: {
          tooltip: {isHtml: true},
          animation: {
            duration: 1000,
            easing: 'inAndOut',
            startup: true,
          },
          chartArea: { top: 64, height: '90%' },
          title: 'Number of Unique Products certified to specific Certification Criteria',
        },
      };
    }

    _getCriterionProductCountDataInChartFormat (data) {
      return data.criterionProductStatisticsResult
        .map((obj) => ({
          ...obj,
          number: obj.criterion.number,
          title: obj.criterion.title,
        }))
        .sort(sortCriteria)
        .map(obj => {
          return {c: [{
            v: obj.criterion.number,
          },{v: obj.productCount}, {v: 'Name: ' + obj.criterion.title + '\n Count: ' + obj.productCount}]};
        });
    }
  },
};

angular.module('chpl.charts')
  .component('chplChartsProduct', ChartsProductComponent);
