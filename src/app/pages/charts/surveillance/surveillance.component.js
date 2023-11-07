export const ChartsSurveillanceComponent = {
  templateUrl: 'chpl.charts/surveillance/surveillance.html',
  bindings: {
    nonconformityCriteriaCount: '<',
  },
  controller: class ChartsSurveillanceComponent {
    constructor ($analytics, $log, utilService) {
      'ngInject';
      this.$analytics = $analytics;
      this.$log = $log;
      this.utilService = utilService;
      this.nonconformityTypes = [
        'All',
        'Certification Criteria',
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
        'Certification Criteria': {
          type: 'ColumnChart',
          data: {
            cols: [
              { label: 'Certification Criteria Surveilled', type: 'string'},
              { label: 'Number of Non-Conformities', type: 'number'},
            ],
            rows: this._getNonconformityCountDataInChartFormat(data, 'Certification Criteria'),
          },
          options: {
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            title: 'Number of Non-Conformities by Certification Criteria Surveilled',
            hAxis: {
              title: 'Certification Criteria Surveilled',
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
              { label: 'Program Requirements Surveilled', type: 'string'},
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
            title: 'Number of Non-Conformities by Program Requirements Surveilled',
            hAxis: {
              title: 'Program Requirements Surveilled',
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
            obj.nonconformityType = (obj.criterion.removed ? 'Removed | ' : '') + obj.criterion.number;
          }
          obj.number = obj.criterion ? obj.criterion.number : obj.nonconformityType;
          obj.title = obj.criterion ? obj.criterion.title : '';
          return obj;
        })
        .filter(obj => {
          switch (type) {
          case 'Certification Criteria':
            return obj.nonconformityType.includes('170.315');
          case 'Program':
            return obj.nonconformityType.includes('170.523') || obj.nonconformityType.includes('Other');
          case 'All':
            return !obj.nonconformityType.includes('170.314');
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
