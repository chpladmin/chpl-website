export const ChartsProductComponent = {
  templateUrl: 'chpl.charts/product/product.html',
  bindings: {
    criterionProduct: '<',
  },
  controller: class ChartsProductComponent {
    constructor ($analytics, $log, featureFlags, utilService) {
      'ngInject';
      this.$analytics = $analytics;
      this.$log = $log;
      this.isOn = featureFlags.isOn;
      this.utilService = utilService;
      this.criteriaTypes = this.isOn('editionless') ? undefined : [
        'All',
        2015,
        '2015 Cures Update',
      ];
      this.chartState = {
        criteriaType: 'All',
      };
    }

    $onChanges (changes) {
      if (changes.criterionProduct) {
        this._createCriterionProductCountChart(changes.criterionProduct.currentValue);
      }
    }

    updateType () {
      this.$analytics.eventTrack('Filter Unique Product Charts', { category: 'Charts', label: this.chartState.criteriaType });
    }

    _createCriterionProductCountChart (data) {
      this.criterionProductCounts = {
        2014: {
          type: 'BarChart',
          data: {
            cols: [
              { label: 'Certification Criteria', type: 'string'},
              { label: 'Number of Unique Products', type: 'number'},
              { Type: 'string', role: 'tooltip'},
            ],
            rows: this._getCriterionProductCountDataInChartFormat(data, 2014),
          },
          options: {
            tooltip: {isHtml: true},
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            chartArea: { top: 64, height: '90%' },
            title: 'Number of 2014 Edition Unique Products certified to specific Certification Criteria',
          },
        },
        'All': {
          type: 'BarChart',
          data: {
            cols: [
              { label: 'Certification Criteria', type: 'string'},
              { label: 'Number of Unique Products', type: 'number'},
              { type: 'string', role: 'tooltip'},
            ],
            rows: this._getCriterionProductCountDataInChartFormat(data, 'All'),
          },
          options: {
            tooltip: {isHtml: true},
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            chartArea: { top: 64, height: '90%' },
            title: this.isOn('editionless') ? 'Number of Unique Products certified to specific Certification Criteria' : 'Number of 2015 Edition Unique Products certified to specific Certification Criteria',
          },
        },
        2015: {
          type: 'BarChart',
          data: {
            cols: [
              { label: 'Certification Criteria', type: 'string'},
              { label: 'Number of Unique Products', type: 'number'},
              { type: 'string', role: 'tooltip'},
            ],
            rows: this._getCriterionProductCountDataInChartFormat(data, 2015),
          },
          options: {
            tooltip: {isHtml: true},
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            chartArea: { top: 64, height: '90%' },
            title: this.isOn('editionless') ? 'Number of Unique Products certified to specific Certification Criteria' : 'Number of 2015 Edition Unique Products certified to specific Certification Criteria',
          },
        },
        '2015 Cures Update': {
          type: 'BarChart',
          data: {
            cols: [
              { label: 'Certification Criteria', type: 'string'},
              { label: 'Number of Unique Products', type: 'number'},
              { type: 'string', role: 'tooltip'},
            ],
            rows: this._getCriterionProductCountDataInChartFormat(data, '2015 Cures Update'),
          },
          options: {
            tooltip: {isHtml: true},
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            chartArea: { top: 64, height: '90%' },
            title: this.isOn('editionless') ? 'Number of Unique Products certified to specific Certification Criteria' : 'Number of 2015 Edition Unique Products certified to specific Cures Update Certification Criteria',
          },
        },
      };
    }

    _getCriterionProductCountDataInChartFormat (data, edition) {
      return data.criterionProductStatisticsResult
        .filter(obj => {
          switch (edition) {
          case 2014:
            return obj.criterion.certificationEdition === '2014';
          case 'All':
            return obj.criterion.certificationEdition === '2015';
          case 2015:
            return obj.criterion.certificationEdition === '2015' && !obj.criterion.title.includes('Cures Update');
          case '2015 Cures Update':
            return obj.criterion.certificationEdition === '2015' && obj.criterion.title.includes('Cures Update');
          default: false;
          }
        })
        .map(obj => {
          obj.number = obj.criterion.number;
          obj.title = obj.criterion.title;
          return obj;
        })
        .sort((a, b) => this.utilService.sortCertActual(a, b))
        .map(obj => {
          return {c: [{
            v: (obj.criterion.title.indexOf('Cures Update') > 0 ? ' (Cures Update)' : '') + obj.criterion.number,
          },{v: obj.productCount}, {v: 'Name: ' + obj.criterion.title + '\n Count: ' + obj.productCount}]};
        });
    }
  },
};

angular.module('chpl.charts')
  .component('chplChartsProduct', ChartsProductComponent);
