import { sortCriteria } from 'services/criteria.service';

const getCriterionProductCountDataInChartFormat = (data) => data.criterionProductStatisticsResult
  .map((obj) => ({
    ...obj,
    number: obj.criterion.number,
    title: obj.criterion.title,
  }))
  .sort(sortCriteria)
  .map((obj) => ({
    c: [{
      v: obj.criterion.number,
    }, { v: obj.productCount }, { v: `Name: ${obj.criterion.title}\n Count: ${obj.productCount}` }],
  }));

const ChartsProductComponent = {
  templateUrl: 'chpl.charts/product/product.html',
  bindings: {
    criterionProduct: '<',
  },
  controller: class ChartsProductComponent {
    constructor($analytics, $log, utilService) {
      'ngInject';

      this.$analytics = $analytics;
      this.$log = $log;
      this.utilService = utilService;
    }

    $onChanges(changes) {
      if (changes.criterionProduct) {
        this.createCriterionProductCountChart(changes.criterionProduct.currentValue);
      }
    }

    createCriterionProductCountChart(data) {
      this.criterionProductCounts = {
        type: 'BarChart',
        data: {
          cols: [
            { label: 'Certification Criteria', type: 'string' },
            { label: 'Number of Unique Products', type: 'number' },
            { type: 'string', role: 'tooltip' },
          ],
          rows: getCriterionProductCountDataInChartFormat(data),
        },
        options: {
          tooltip: { isHtml: true },
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
  },
};

angular.module('chpl.charts')
  .component('chplChartsProduct', ChartsProductComponent);

export default ChartsProductComponent;
