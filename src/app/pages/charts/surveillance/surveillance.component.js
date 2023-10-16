export const ChartsSurveillanceComponent = {
  templateUrl: 'chpl.charts/surveillance/surveillance.html',
  bindings: {
    nonconformityCriteriaCount: '<',
  },
  controller: class ChartsSurveillanceComponent {
    constructor ($analytics, $log, featureFlags, utilService) {
      'ngInject';
      this.$analytics = $analytics;
      this.$log = $log;
      this.isOn = featureFlags.isOn;
      this.utilService = utilService;
      this.nonconformityTypes = this.isOn('editionless') ? [
        'All',
        'All criteria',
        'Program',
      ] : [
        'All',
        2015,
        '2015 Cures Update',
        'Program',
      ];
      this.chartState = {
        yAxis: '',
        nonconformityCountType: 'All',
      };
    }

    $onChanges (changes) {
      if (changes.nonconformityCriteriaCount) {
        this._createNonconformityCountChart(changes.nonconformityCriteriaCount.currentValue);
      }
    }

    updateType () {
      this.$analytics.eventTrack('Filter Non-conformity Charts by Type of Program Requirements Surveilled', { category: 'Charts', label: this.chartState.nonconformityCountType });
    }

    updateYAxis () {
      let that = this;
      Object.values(this.nonconformityCounts).forEach(value => {
        value.options.vAxis.scaleType = that.chartState.yAxis;
      });
      let type = this.chartState.yAxis === 'mirrorLog' ? 'Log' : 'Linear';
      this.$analytics.eventTrack('Change Non-conformity Charts Y Axis', { category: 'Charts', label: type });
    }

    _createNonconformityCountChart (data) {
      this.nonconformityCounts = {
        'All criteria': {
          type: 'ColumnChart',
          data: {
            cols: [
              { label: 'All Certification Criteria and Program Requirements Surveilled', type: 'string'},
              { label: 'Number of Non-Conformities', type: 'number'},
            ],
            rows: this._getNonconformityCountDataInChartFormat(data, 'All criteria'),
          },
          options: {
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
            hAxis: {
              title: 'All Certification Criteria and Program Requirements Surveilled',
              minValue: 0,
            },
            vAxis: {
              scaleType: this.chartState.yAxis,
              title: 'Number of Non-Conformities',
              minValue: 0,
            },
          },
        },
        'All': {
          type: 'ColumnChart',
          data: {
            cols: [
              { label: 'All Certification Criteria and Program Requirements Surveilled', type: 'string'},
              { label: 'Number of Non-Conformities', type: 'number'},
            ],
            rows: this._getNonconformityCountDataInChartFormat(data, 'All'),
          },
          options: {
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
            hAxis: {
              title: 'All Certification Criteria and Program Requirements Surveilled',
              minValue: 0,
            },
            vAxis: {
              scaleType: this.chartState.yAxis,
              title: 'Number of Non-Conformities',
              minValue: 0,
            },
          },
        },
        2014: {
          type: 'ColumnChart',
          data: {
            cols: [
              { label: '2014 Certification Criteria and Program Requirements Surveilled', type: 'string'},
              { label: 'Number of Non-Conformities', type: 'number'},
            ],
            rows: this._getNonconformityCountDataInChartFormat(data, 2014),
          },
          options: {
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
            hAxis: {
              title: '2014 Certification Criteria and Program Requirements Surveilled',
              minValue: 0,
            },
            vAxis: {
              scaleType: this.chartState.yAxis,
              title: 'Number of Non-Conformities',
              minValue: 0,
            },
          },
        },
        2015: {
          type: 'ColumnChart',
          data: {
            cols: [
              { label: '2015 Certification Criteria and Program Requirements Surveilled', type: 'string'},
              { label: 'Number of Non-Conformities', type: 'number'},
            ],
            rows: this._getNonconformityCountDataInChartFormat(data, 2015),
          },
          options: {
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
            hAxis: {
              title: '2015 Certification Criteria and Program Requirements Surveilled',
              minValue: 0,
            },
            vAxis: {
              scaleType: this.chartState.yAxis,
              title: 'Number of Non-Conformities',
              minValue: 0,
            },
          },
        },
        '2015 Cures Update': {
          type: 'ColumnChart',
          data: {
            cols: [
              { label: '2015 Cures Update Certification Criteria and Program Requirements Surveilled', type: 'string'},
              { label: 'Number of Non-Conformities', type: 'number'},
            ],
            rows: this._getNonconformityCountDataInChartFormat(data, '2015 Cures Update'),
          },
          options: {
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
            hAxis: {
              title: '2015 Cures Update Certification Criteria and Program Requirements Surveilled',
              minValue: 0,
            },
            vAxis: {
              scaleType: this.chartState.yAxis,
              title: 'Number of Non-Conformities',
              minValue: 0,
            },
          },
        },
        'Program': {
          type: 'ColumnChart',
          data: {
            cols: [
              { label: 'Program Certification Criteria and Program Requirements Surveilled', type: 'string'},
              { label: 'Number of Non-Conformities', type: 'number'},
            ],
            rows: this._getNonconformityCountDataInChartFormat(data, 'Program'),
          },
          options: {
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
            hAxis: {
              title: 'Program Certification Criteria and Program Requirements Surveilled',
              minValue: 0,
            },
            vAxis: {
              scaleType: this.chartState.yAxis,
              title: 'Number of Non-Conformities',
              minValue: 0,
            },
          },
        },
      };
    }

    _getNonconformityCountDataInChartFormat (data, type) {
      return data.nonconformityStatisticsResult
        .map(obj => {
          if (obj.criterion) {
            obj.nonconformityType = obj.criterion.number + (obj.criterion.title.indexOf('Cures Update') > -1 ? ' (Cures Update)' : '');
          }
          obj.number = obj.criterion ? obj.criterion.number : obj.nonconformityType;
          obj.title = obj.criterion ? obj.criterion.title : '';
          return obj;
        })
        .filter(obj => {
          switch (type) {
            case 'All criteria':
              return (!obj.nonconformityType.includes('170.523') && !obj.nonconformityType.includes('Other'));
            case 2015:
              return (obj.nonconformityType.includes('170.315') && !obj.nonconformityType.includes('Cures Update'));
            case '2015 Cures Update':
              return obj.nonconformityType.includes('Cures Update');
            case 'Program':
              return obj.nonconformityType.includes('170.523') || obj.nonconformityType.includes('Other');
            case 'All':
              return this.isOn('editionless') ? true : !obj.nonconformityType.includes('170.314');
            default:
              return false;
          }
        })
        .sort((a, b) => this.utilService.sortCertActual(a, b))
        .map(obj => ({c: [{ v: obj.nonconformityType},{v: obj.nonconformityCount}]}));
    }
  },
};

angular.module('chpl.charts')
  .component('chplChartsSurveillance', ChartsSurveillanceComponent);
