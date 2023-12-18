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
    }, { v: obj.productCount }, { v: `${obj.criterion.number} : ${obj.criterion.title}\n\n Count: ${obj.productCount}` }],
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
          vAxis: {
            title: 'All Certification Criteria',
            minValue: 0,
            textStyle : {
              fontSize: 14,
            },
          },
          hAxis: {
            title: 'Number of Unique Products',
            minValue: 0,
          },
          height: '2200',
          chartArea: {width: '60%', height: '2000'},
          bar: { groupWidth: 20 },  
          tooltip: { 
            textStyle : {
              fontSize: 14,
            }, 
          },
          animation: {
            duration: 1000,
            easing: 'inAndOut',
            startup: true,
          },
          title: 'Number of Unique Products certified to specific Certification Criteria',
        },
      };
    }
  },
};

angular.module('chpl.charts')
  .component('chplChartsProduct', ChartsProductComponent);

export default ChartsProductComponent;
